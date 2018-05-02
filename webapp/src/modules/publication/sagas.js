import { call, takeEvery, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { eth } from 'decentraland-eth'
import {
  FETCH_PUBLICATIONS_REQUEST,
  FETCH_DASHBOARD_PUBLICATIONS_REQUEST,
  FETCH_PARCEL_PUBLICATIONS_REQUEST,
  PUBLISH_REQUEST,
  BUY_REQUEST,
  CANCEL_SALE_REQUEST,
  fetchPublicationsSuccess,
  fetchPublicationsFailure,
  fetchDashboardPublicationsSuccess,
  fetchDashboardPublicationsFailure,
  fetchParcelPublicationsSuccess,
  fetchParcelPublicationsFailure,
  publishSuccess,
  publishFailure,
  buySuccess,
  buyFailure,
  cancelSaleSuccess,
  cancelSaleFailure
} from './actions'
import { locations } from 'locations'
import { api } from 'lib/api'

export function* publicationSaga() {
  yield takeEvery(FETCH_PUBLICATIONS_REQUEST, handlePublicationsRequest)
  yield takeEvery(
    FETCH_DASHBOARD_PUBLICATIONS_REQUEST,
    handleDashboardPublicationsRequest
  )
  yield takeEvery(
    FETCH_PARCEL_PUBLICATIONS_REQUEST,
    handleParcelPublicationsRequest
  )
  yield takeEvery(PUBLISH_REQUEST, handlePublishRequest)
  yield takeEvery(BUY_REQUEST, handleBuyRequest)
  yield takeEvery(CANCEL_SALE_REQUEST, handleCancelSaleRequest)
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

function* handleDashboardPublicationsRequest(action) {
  try {
    const { parcels, publications, total } = yield call(() =>
      fetchPublications(action)
    )
    yield put(fetchDashboardPublicationsSuccess(parcels, publications, total))
  } catch (error) {
    yield put(fetchDashboardPublicationsFailure(error.message))
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
    const { x, y, price, expires_at } = action.publication

    const marketplaceContract = eth.getContract('Marketplace')
    const landRegistryContract = eth.getContract('LANDRegistry')

    const assetId = yield call(() => landRegistryContract.encodeTokenId(x, y))
    const priceInWei = eth.utils.toWei(price)

    const txHash = yield call(() =>
      marketplaceContract.createOrder(assetId, priceInWei, expires_at)
    )

    const publication = {
      tx_hash: txHash,
      ...action.publication
    }

    yield put(publishSuccess(txHash, publication))
    yield put(push(locations.activity))
  } catch (error) {
    yield put(publishFailure(error.message))
  }
}

function* handleBuyRequest(action) {
  try {
    const { x, y, price } = action.publication

    const marketplaceContract = eth.getContract('Marketplace')
    const landRegistryContract = eth.getContract('LANDRegistry')

    const assetId = yield call(() => landRegistryContract.encodeTokenId(x, y))
    const txHash = yield call(() =>
      marketplaceContract.executeOrder(assetId, eth.utils.toWei(price))
    )

    yield put(buySuccess(txHash, action.publication))
    yield put(push(locations.activity))
  } catch (error) {
    yield put(buyFailure(error.message))
  }
}

function* handleCancelSaleRequest(action) {
  try {
    const { x, y } = action.publication

    const marketplaceContract = eth.getContract('Marketplace')
    const landRegistryContract = eth.getContract('LANDRegistry')

    const assetId = yield call(() => landRegistryContract.encodeTokenId(x, y))
    const txHash = yield call(() => marketplaceContract.cancelOrder(assetId))

    yield put(cancelSaleSuccess(txHash, action.publication))
    yield put(push(locations.activity))
  } catch (error) {
    yield put(cancelSaleFailure(error.message))
  }
}

function* fetchPublications(action) {
  const { limit, offset, sortBy, sortOrder, status } = action
  const { parcels, total } = yield call(() =>
    api.fetchParcels({ limit, offset, sortBy, sortOrder, status })
  )
  const publications = parcels.map(parcel => parcel.publication)
  return { parcels, publications, total }
}
