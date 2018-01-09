import { takeEvery, call, put } from 'redux-saga/effects'
import {
  FETCH_PARCELS_REQUEST,
  FETCH_PARCELS_SUCCESS,
  FETCH_PARCELS_FAILURE
} from './actions'
import api from 'lib/api'
import { buildCoordinate } from 'lib/utils'

export default function* saga() {
  yield takeEvery(FETCH_PARCELS_REQUEST, handleParcelsRequest)
}

function* handleParcelsRequest(action) {
  try {
    const nw = buildCoordinate(action.nw.x, action.nw.y)
    const se = buildCoordinate(action.se.x, action.se.y)
    const parcelsArray = yield call(() => api.fetchParcels(nw, se))
    const parcels = parcelsArray.reduce((map, parcel) => {
      map[parcel.id] = parcel
      return map
    }, {})
    yield put({
      type: FETCH_PARCELS_SUCCESS,
      parcels
    })
  } catch (error) {
    yield put({
      type: FETCH_PARCELS_FAILURE,
      error: error.message
    })
  }
}
