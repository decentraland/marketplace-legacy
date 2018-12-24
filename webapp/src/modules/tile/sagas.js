import { take, takeEvery, select, call, put } from 'redux-saga/effects'

import {
  FETCH_TILES_REQUEST,
  fetchTilesSuccess,
  fetchTilesFailure
} from './actions'
import { CONNECT_WALLET_SUCCESS } from 'modules/wallet/actions'
import { getAddress } from 'modules/wallet/selectors'
import { api } from 'lib/api'

export function* tileSaga() {
  yield takeEvery(FETCH_TILES_REQUEST, handleTilesRequest)
}

function* handleTilesRequest(action) {
  try {
    const tiles = yield call(() => api.fetchTiles())
    yield put(fetchTilesSuccess(tiles))

    let address = yield select(getAddress)

    if (!address) {
      const action = yield take(CONNECT_WALLET_SUCCESS)
      address = action.payload.wallet.address
    }

    const ownerTiles = yield call(() => api.fetchAddressTiles(address))
    yield put(fetchTilesSuccess(ownerTiles))
  } catch (error) {
    yield put(fetchTilesFailure(error.message))
  }
}
