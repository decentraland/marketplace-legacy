import { call, takeEvery, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { eth } from 'decentraland-commons'
import {
  FETCH_PUBLICATIONS_REQUEST,
  PUBLISH_REQUEST,
  BUY_REQUEST,
  CANCEL_SALE_REQUEST,
  fetchPublicationsSuccess,
  fetchPublicationsFailure,
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
  yield takeEvery(PUBLISH_REQUEST, handlePublishRequest)
  yield takeEvery(BUY_REQUEST, handleBuyRequest)
  yield takeEvery(CANCEL_SALE_REQUEST, handleCancelSaleRequest)
}

function* handlePublicationsRequest(action) {
  const { limit, offset, sortBy, sortOrder } = action
  try {
    const { publications, total } = yield call(() =>
      api.fetchPublications({ limit, offset, sortBy, sortOrder })
    )
    yield put(fetchPublicationsSuccess(publications, total))
  } catch (error) {
    yield put(fetchPublicationsFailure(error.message))
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
    const { x, y } = action.publication

    const marketplaceContract = eth.getContract('Marketplace')
    const landRegistryContract = eth.getContract('LANDRegistry')

    const assetId = yield call(() => landRegistryContract.encodeTokenId(x, y))

    const txHash = yield call(() => marketplaceContract.executeOrder(assetId))

    yield put(buySuccess(txHash))
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

    yield put(cancelSaleSuccess(txHash))
    yield put(push(locations.activity))
  } catch (error) {
    yield put(cancelSaleFailure(error.message))
  }
}
