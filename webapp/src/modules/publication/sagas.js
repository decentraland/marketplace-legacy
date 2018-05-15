import { call, takeEvery, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { eth } from 'decentraland-eth'
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
  cancelSaleFailure
} from './actions'
import { locations } from 'locations'
import { api } from 'lib/api'

export function* publicationSaga() {
  yield takeEvery(FETCH_PUBLICATIONS_REQUEST, handlePublicationsRequest)
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
    const { asset_id, price, expires_at } = action.publication
    const priceInWei = eth.utils.toWei(price)

    const marketplaceContract = eth.getContract('Marketplace')
    const txHash = yield call(() =>
      marketplaceContract.createOrder(asset_id, priceInWei, expires_at)
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
    const { asset_id, price } = action.publication

    const marketplaceContract = eth.getContract('Marketplace')
    const txHash = yield call(() =>
      marketplaceContract.executeOrder(asset_id, eth.utils.toWei(price))
    )

    yield put(buySuccess(txHash, action.publication))
    yield put(push(locations.activity))
  } catch (error) {
    yield put(buyFailure(error.message))
  }
}

function* handleCancelSaleRequest(action) {
  try {
    const { asset_id } = action.publication

    const marketplaceContract = eth.getContract('Marketplace')
    const txHash = yield call(() => marketplaceContract.cancelOrder(asset_id))

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
