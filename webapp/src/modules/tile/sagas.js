import { takeEvery, call, select, put } from 'redux-saga/effects'

import {
  FETCH_TILES_REQUEST,
  fetchTilesSuccess,
  fetchTilesFailure
} from './actions'
import { getAddress } from 'modules/wallet/selectors'
import { buildCoordinate } from 'shared/coordinates'
import { api } from 'lib/api'

export function* tileSaga() {
  yield takeEvery(FETCH_TILES_REQUEST, handleTilesRequest)
}

function* handleTilesRequest(action) {
  try {
    const nw = buildCoordinate(action.nw.x, action.nw.y)
    const se = buildCoordinate(action.se.x, action.se.y)
    const address = yield select(getAddress)
    const tiles = yield call(() => api.fetchTiles(nw, se, address))

    yield put(fetchTilesSuccess(tiles))
  } catch (error) {
    yield put(fetchTilesFailure(error.message))
  }
}
