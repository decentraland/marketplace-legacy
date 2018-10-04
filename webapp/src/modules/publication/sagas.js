import { select, call, takeEvery, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { eth } from 'decentraland-eth'
import { locations, MARKETPLACE_PAGE_TABS } from 'locations'
import { getAddress } from 'modules/wallet/selectors'
import { splitCoordinate } from 'shared/parcel'
import { api } from 'lib/api'
import {
  FETCH_PUBLICATIONS_REQUEST,
  FETCH_PARCEL_PUBLICATIONS_REQUEST,
  PUBLISH_REQUEST,
  BUY_REQUEST,
  CANCEL_SALE_REQUEST,
  fetchPublicationsSuccess,
  fetchPublicationsFailure,
  fetchParcelPublicationsSuccess,
  fetchParcelPublicationsFailure,
  publishSuccess,
  publishFailure,
  buySuccess,
  buyFailure,
  cancelSaleSuccess,
  cancelSaleFailure,
  fetchParcelPublicationsRequest
} from './actions'
import { getTotals } from 'modules/ui/marketplace/selectors'
import {
  getNFTAddressByType,
  isLegacyPublication,
  getTypeByMarketplaceTab
} from './utils'
import { FETCH_PARCEL_SUCCESS } from 'modules/parcels/actions'
import { ASSET_TYPES } from 'shared/asset'
import { getData as getEstates } from 'modules/estates/selectors'

export function* publicationSaga() {
  yield takeEvery(FETCH_PUBLICATIONS_REQUEST, handlePublicationsRequest)
  yield takeEvery(
    FETCH_PARCEL_PUBLICATIONS_REQUEST,
    handleParcelPublicationsRequest
  )
  yield takeEvery(PUBLISH_REQUEST, handlePublishRequest)
  yield takeEvery(BUY_REQUEST, handleBuyRequest)
  yield takeEvery(CANCEL_SALE_REQUEST, handleCancelSaleRequest)
  yield takeEvery(FETCH_PARCEL_SUCCESS, handleFetchParcelSuccess)
}

function* handlePublicationsRequest(action) {
  try {
    const { offset } = action
    let nextTab = action.tab || MARKETPLACE_PAGE_TABS.parcels
    const totals = yield select(getTotals)
    if (offset === 0) {
      for (let page in MARKETPLACE_PAGE_TABS) {
        if (page !== nextTab) {
          totals[getTypeByMarketplaceTab(page)] = (yield call(() =>
            api.fetchAssets(page, action)
          )).total
        }
      }
    }
    const { assets, total, publications, type } = yield call(() =>
      fetchPublications(action)
    )

    totals[getTypeByMarketplaceTab(nextTab)] = total
    yield put(
      fetchPublicationsSuccess({
        assets,
        totals,
        publications,
        assetType: type
      })
    )
  } catch (error) {
    yield put(fetchPublicationsFailure(error.message))
  }
}

function* handleParcelPublicationsRequest(action) {
  try {
    const { x, y } = action
    const publications = yield call(() => api.fetchParcelPublications(x, y))

    yield put(fetchParcelPublicationsSuccess(publications, x, y))
  } catch (error) {
    yield put(fetchParcelPublicationsFailure(error.message))
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
  yield put(fetchParcelPublicationsRequest(action.x, action.y))
}

function* fetchPublications(action) {
  const { limit, offset, sortBy, sortOrder, status } = action
  const nextTab = action.tab || MARKETPLACE_PAGE_TABS.parcels
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
