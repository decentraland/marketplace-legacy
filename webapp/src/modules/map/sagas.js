import { takeEvery, select, call, put } from 'redux-saga/effects'
import { buildCoordinate } from 'shared/parcel'
import { api } from 'lib/api'
import { webworker } from 'lib/webworker'
import { FETCH_MAP_REQUEST, fetchMapSuccess, fetchMapFailure } from './actions'
import { getData as getParcels } from 'modules/parcels/selectors'

export function* mapSaga() {
  yield takeEvery(FETCH_MAP_REQUEST, handleMapRequest)
}

function* handleMapRequest(action) {
  try {
    const nw = buildCoordinate(action.nw.x, action.nw.y)
    const se = buildCoordinate(action.se.x, action.se.y)
    const { assets } = yield call(() => api.fetchMapInRange(nw, se))
    const allParcels = yield select(getParcels)

    const result = yield call(() =>
      webworker.postMessage({
        type: 'FETCH_MAP_REQUEST',
        assets,
        allParcels
      })
    )
    assets.parcels = result.parcels
    assets.estates = result.estates

    yield put(fetchMapSuccess(assets, result.publications))
  } catch (error) {
    yield put(fetchMapFailure(error.message))
  }
}
