import { select, call, takeEvery, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { eth } from 'decentraland-eth'
import { locations } from 'locations'
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
import { FETCH_PARCEL_SUCCESS } from 'modules/parcels/actions'

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
    const { parcels, publications, total } = yield call(() =>
      fetchPublications(action)
    )
    yield put(fetchPublicationsSuccess(parcels, publications, total))
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
    const { id, price, expires_at } = action.publication
    const priceInWei = eth.utils.toWei(price)
    const asset = yield call(() => buildAsset(id))

    const marketplaceContract = eth.getContract('LegacyMarketplace')

    const txHash = yield call(() =>
      marketplaceContract.createOrder(asset.id, priceInWei, expires_at)
    )

    const publication = {
      tx_hash: txHash,
      asset_id: id,
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
    const { asset_id, price } = action.publication
    const asset = yield call(() => buildAsset(asset_id))
    const buyer = yield select(getAddress)

    const marketplaceContract = eth.getContract('LegacyMarketplace')
    const txHash = yield call(() =>
      marketplaceContract.executeOrder(asset.id, eth.utils.toWei(price))
    )

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
    const { asset_id } = action.publication
    const asset = yield call(() => buildAsset(asset_id))

    const marketplaceContract = eth.getContract('LegacyMarketplace')
    const txHash = yield call(() => marketplaceContract.cancelOrder(asset.id))

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
  const { parcels, total } = yield call(() =>
    api.fetchParcels({ limit, offset, sortBy, sortOrder, status })
  )
  const publications = parcels.map(parcel => parcel.publication)
  return { parcels, publications, total }
}

function* buildAsset(asset_id) {
  // TODO: if publication.asset_type === 'parcel' then split and encode
  //  if publication.asset_type === 'estate' then ??

  const [x, y] = splitCoordinate(asset_id)

  const landRegistryContract = eth.getContract('LANDRegistry')
  const blockchainId = yield call(() =>
    landRegistryContract.encodeTokenId(x, y)
  )

  return {
    id: blockchainId.toString(),
    x: parseInt(x, 10),
    y: parseInt(y, 10)
  }
}
