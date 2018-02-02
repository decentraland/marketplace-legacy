import { takeEvery, put, select } from 'redux-saga/effects'
import { getParcels } from 'modules/parcels/reducer'
import { buildCoordinate } from 'lib/utils'
import { inBounds } from 'lib/parcelUtils'
import { fetchParcelData, fetchParcels } from 'modules/parcels/actions'
import { CHANGE_RANGE, HOVER_PARCEL } from './actions'

export function* mapSaga() {
  yield takeEvery(CHANGE_RANGE, handleChangeRange)
  yield takeEvery(HOVER_PARCEL, handleHoverParcel)
}

function* handleChangeRange(action) {
  const { nw, se } = action
  yield put(fetchParcels(nw, se))
}

function* handleHoverParcel(action) {
  const { x, y } = action
  if (!inBounds(x, y)) return
  const parcels = yield select(getParcels)
  const parcel = parcels[buildCoordinate(x, y)]
  if (!parcel || !parcel.owner || parcel.data) return // only fetch data if the parcel is loaded and has an owner, but the land data has not been loaded yet
  yield put(fetchParcelData(x, y))
}
