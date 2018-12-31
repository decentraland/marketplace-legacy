import { take, takeEvery, select, call, put } from 'redux-saga/effects'

import {
  FETCH_TILES_REQUEST,
  FETCH_NEW_TILES_REQUEST,
  FETCH_ADDRESS_TILES_REQUEST,
  fetchTilesSuccess,
  fetchTilesFailure,
  fetchNewTilesSuccess,
  fetchNewTilesFailure,
  fetchAddressTilesRequest,
  fetchAddressTilesSuccess,
  fetchAddressTilesFailure
} from './actions'
import { CONNECT_WALLET_SUCCESS } from 'modules/wallet/actions'
import { getAddress } from 'modules/wallet/selectors'
import { api } from 'lib/api'

export function* tileSaga() {
  yield takeEvery(FETCH_TILES_REQUEST, handleTilesRequest)
  yield takeEvery(FETCH_NEW_TILES_REQUEST, handleNewTilesRequest)
  yield takeEvery(FETCH_ADDRESS_TILES_REQUEST, handleAddressTilesRequest)
}

function* handleTilesRequest(action) {
  try {
    const tiles = yield call(() => api.fetchTiles())
    yield put(fetchTilesSuccess(tiles))

    yield fetchTilesForConnectedAddress()
  } catch (error) {
    yield put(fetchTilesFailure(error.message))
  }
}

function* handleNewTilesRequest(action) {
  try {
    const { from } = action
    const address = yield select(getAddress)

    const tiles = yield call(() => api.fetchNewTiles(from, address))
    yield put(fetchNewTilesSuccess(tiles))
  } catch (error) {
    yield put(fetchNewTilesFailure(error.message))
  }
}

function* fetchTilesForConnectedAddress() {
  let address = yield select(getAddress)

  if (!address) {
    const action = yield take(CONNECT_WALLET_SUCCESS)
    address = action.payload.wallet.address
  }

  yield put(fetchAddressTilesRequest(address))
}

function* handleAddressTilesRequest(action) {
  try {
    const ownerTiles = yield call(() => api.fetchAddressTiles(action.address))
    yield put(fetchAddressTilesSuccess(ownerTiles))
  } catch (error) {
    yield put(fetchAddressTilesFailure(error.message))
  }
}
