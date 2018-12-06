import { takeEvery, call, select, put } from 'redux-saga/effects'

import { FETCH_MAP_REQUEST, fetchMapSuccess, fetchMapFailure } from './actions'
import { getAddress } from 'modules/wallet/selectors'
import { buildCoordinate } from 'shared/coordinates'
import { api } from 'lib/api'

export function* mapSaga() {
  yield takeEvery(FETCH_MAP_REQUEST, handleMapRequest)
}

function* handleMapRequest(action) {
  try {
    const nw = buildCoordinate(action.nw.x, action.nw.y)
    const se = buildCoordinate(action.se.x, action.se.y)
    const address = yield select(getAddress)
    const map = yield call(() => api.fetchMap(nw, se, address))

    yield put(fetchMapSuccess(map))
  } catch (error) {
    yield put(fetchMapFailure(error.message))
  }
}
