import { takeEvery, select, call, put } from 'redux-saga/effects'
import { buildCoordinate } from 'shared/parcel'
import { api } from 'lib/api'
import { webworker } from 'lib/webworker'
import { fetchMapSuccess, FETCH_MAP_REQUEST, fetchMapFailure } from './actions'
import { getData as getParcels } from 'modules/parcels/selectors'

export function* mapSaga() {
  yield takeEvery(FETCH_MAP_REQUEST, handleMapRequest)
}

function* handleMapRequest(action) {
  try {
    const nw = buildCoordinate(action.nw.x, action.nw.y)
    const se = buildCoordinate(action.se.x, action.se.y)
    const { assets } = yield call(() => api.fetchMapInRange(nw, se))
    const stateParcels = yield select(getParcels)

    const result = yield call(() =>
      webworker.postMessage({
        type: 'FETCH_PARCELS_REQUEST',
        parcels: assets.parcels,
        allParcels: stateParcels
      })
    )
    assets.parcels = result.parcels

    yield put(fetchMapSuccess(assets, result.publications))
  } catch (error) {
    yield put(fetchMapFailure(error.message))
  }
}
