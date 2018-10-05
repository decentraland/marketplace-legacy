import { select, call, takeEvery, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { eth } from 'decentraland-eth'
import { locations, MARKETPLACE_PAGE_TABS } from 'locations'
import { getAddress } from 'modules/wallet/selectors'
import { splitCoordinate } from 'shared/parcel'
import { api } from 'lib/api'
import {
  FETCH_PUBLICATIONS_REQUEST,
  FETCH_ASSET_PUBLICATIONS_REQUEST,
  PUBLISH_REQUEST,
  BUY_REQUEST,
  CANCEL_SALE_REQUEST,
  FETCH_ALL_PUBLICATIONS_REQUEST,
  FETCH_ALL_MARKETPLACE_PUBLICATIONS_REQUEST,
  fetchPublicationsSuccess,
  fetchPublicationsFailure,
  fetchAssetPublicationsRequest,
  fetchAssetPublicationsSuccess,
  fetchAssetPublicationsFailure,
  publishSuccess,
  publishFailure,
  buySuccess,
  buyFailure,
  cancelSaleSuccess,
  cancelSaleFailure,
  fetchAllPublicationsSuccess,
  fetchAllPublicationsFailure,
  fetchAllMarketplacePublicationsSuccess,
  fetchAllMarketplacePublicationsFailure
} from './actions'
import {
  getNFTAddressByType,
  isLegacyPublication,
  getTypeByMarketplaceTab
} from './utils'
import { FETCH_PARCEL_SUCCESS } from 'modules/parcels/actions'
import { FETCH_ESTATE_SUCCESS } from 'modules/estates/actions'
import { ASSET_TYPES } from 'shared/asset'
import { getData as getEstates } from 'modules/estates/selectors'

export function* publicationSaga() {
  yield takeEvery(FETCH_PUBLICATIONS_REQUEST, handlePublicationsRequest)
  yield takeEvery(
    FETCH_ASSET_PUBLICATIONS_REQUEST,
    handleAssetPublicationsRequest
  )
  yield takeEvery(PUBLISH_REQUEST, handlePublishRequest)
  yield takeEvery(BUY_REQUEST, handleBuyRequest)
  yield takeEvery(CANCEL_SALE_REQUEST, handleCancelSaleRequest)
  yield takeEvery(FETCH_PARCEL_SUCCESS, handleFetchParcelSuccess)
  yield takeEvery(FETCH_ALL_PUBLICATIONS_REQUEST, handleAllPublicationsRequest)
  yield takeEvery(
    FETCH_ALL_MARKETPLACE_PUBLICATIONS_REQUEST,
    handleAllMarketplacePublicationsRequest
  )
  yield takeEvery(FETCH_ESTATE_SUCCESS, handleFetchEstateSuccess)
}

function* handlePublicationsRequest(action) {
  try {
    const { assets, total, publications, type } = yield call(() =>
      fetchPublications(action)
    )
    yield put(
      fetchPublicationsSuccess({
        assets,
        total,
        publications,
        assetType: type
      })
    )
  } catch (error) {
    yield put(fetchPublicationsFailure(error.message))
  }
}

function* handleAllPublicationsRequest(action) {
  try {
    const allAssets = [],
      totals = {},
      allPublications = []
    for (let tab in MARKETPLACE_PAGE_TABS) {
      const { assets, total, publications, type } = yield call(() =>
        fetchPublications({ ...action, tab })
      )
      allAssets.push(...assets)
      allPublications.push(...publications)
      totals[type] = total
    }
    totals['all'] = allAssets.length

    yield put(
      fetchAllPublicationsSuccess({
        totals,
        publications: allPublications,
        assets: allAssets
      })
    )
  } catch (error) {
    yield put(fetchAllPublicationsFailure(error.message))
  }
}

function* handleAllMarketplacePublicationsRequest(action) {
  try {
    const { assets, total } = yield call(() => api.fetchMarketplace(action))

    yield put(
      fetchAllMarketplacePublicationsSuccess({
        assets,
        total,
        publications: assets.map(asset => asset.publication)
      })
    )
  } catch (error) {
    yield put(fetchAllMarketplacePublicationsFailure(error.message))
  }
}

function* handleAssetPublicationsRequest(action) {
  try {
    const { id, assetType } = action
    const publications = yield call(() =>
      api.fetchAssetPublications(id, assetType)
    )

    yield put(fetchAssetPublicationsSuccess(publications, id, assetType))
  } catch (error) {
    yield put(fetchAssetPublicationsFailure(error.message))
  }
}

function* handlePublishRequest(action) {
  try {
    const { asset_id, assetType, price, expires_at } = action.publication
    const priceInWei = eth.utils.toWei(price)
    const nftAddress = getNFTAddressByType(assetType)
    const asset = yield call(() => buildAsset(asset_id, assetType))
    const marketplaceContract = eth.getContract('Marketplace')

    const txHash = yield call(() =>
      marketplaceContract.createOrder(
        nftAddress,
        asset.id,
        priceInWei,
        expires_at
      )
    )

    const publication = {
      tx_hash: txHash,
      asset_id,
      ...action.publication
    }

    yield put(publishSuccess(txHash, publication, asset))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(publishFailure(error.message))
  }
}

function* handleBuyRequest(action) {
  try {
    const { asset_id, asset_type, price } = action.publication
    const asset = yield call(() => buildAsset(asset_id, asset_type))
    const nftAddress = getNFTAddressByType(asset_type)
    const buyer = yield select(getAddress)

    let marketplaceContract, txHash
    if (isLegacyPublication(action.publication)) {
      marketplaceContract = eth.getContract('LegacyMarketplace')
      txHash = yield call(() =>
        marketplaceContract.executeOrder(asset.id, eth.utils.toWei(price))
      )
    } else {
      marketplaceContract = eth.getContract('Marketplace')
      if (asset_type === ASSET_TYPES.estate) {
        // get estate fingerprint & call safeExecuteOrder
        const estateContract = eth.getContract('EstateRegistry')
        const figerprint = yield call(() =>
          estateContract.getFingerprint(asset.id)
        )

        txHash = yield call(() =>
          marketplaceContract.safeExecuteOrder(
            nftAddress,
            asset.id,
            eth.utils.toWei(price),
            figerprint
          )
        )
      } else {
        txHash = yield call(() =>
          marketplaceContract.executeOrder(
            nftAddress,
            asset.id,
            eth.utils.toWei(price)
          )
        )
      }
    }

    const publication = {
      ...action.publication,
      buyer
    }

    yield put(buySuccess(txHash, publication, asset))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(buyFailure(error.message))
  }
}

function* handleCancelSaleRequest(action) {
  try {
    const { asset_id, asset_type } = action.publication
    const asset = yield call(() => buildAsset(asset_id, asset_type))
    let marketplaceContract, txHash
    if (isLegacyPublication(action.publication)) {
      marketplaceContract = eth.getContract('LegacyMarketplace')
      txHash = yield call(() => marketplaceContract.cancelOrder(asset.id))
    } else {
      const nftAddress = getNFTAddressByType(asset_type)
      marketplaceContract = eth.getContract('Marketplace')
      txHash = yield call(() =>
        marketplaceContract.cancelOrder(nftAddress, asset.id)
      )
    }

    yield put(cancelSaleSuccess(txHash, action.publication, asset))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(cancelSaleFailure(error.message))
  }
}

function* handleFetchParcelSuccess(action) {
  yield put(fetchAssetPublicationsRequest(action.id, ASSET_TYPES.parcel))
}

function* handleFetchEstateSuccess(action) {
  yield put(fetchAssetPublicationsRequest(action.id, ASSET_TYPES.estate))
}

function* fetchPublications(action) {
  const { limit, offset, sortBy, sortOrder, status, tab } = action
  const nextTab = tab || MARKETPLACE_PAGE_TABS.parcels
  const response = yield call(() =>
    api.fetchAssets(nextTab, {
      limit,
      offset,
      sortBy,
      sortOrder,
      status
    })
  )

  return {
    assets: response[nextTab],
    publications: response[nextTab].map(asset => asset.publication),
    total: response.total,
    type: getTypeByMarketplaceTab(nextTab)
  }
}

function* buildAsset(assetId, assetType) {
  let asset
  if (assetType === ASSET_TYPES.parcel) {
    const [x, y] = splitCoordinate(assetId)

    const landRegistryContract = eth.getContract('LANDRegistry')
    const blockchainId = yield call(() =>
      landRegistryContract.encodeTokenId(x, y)
    )

    asset = {
      id: blockchainId.toString(),
      x: parseInt(x, 10),
      y: parseInt(y, 10)
    }
  } else if (assetType === ASSET_TYPES.estate) {
    const estates = yield select(getEstates)
    const estate = estates[assetId]
    asset = {
      id: assetId,
      data: {
        name: estate.data.name,
        parcels: estate.data.parcels
      }
    }
  }

  return { ...asset, type: assetType }
}
