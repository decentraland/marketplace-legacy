import { takeEvery, put, select } from 'redux-saga/effects'
import { CHANGE_RANGE, HOVER_PARCEL } from './actions'
import { getParcels } from 'modules/parcels/selectors'
import {
  fetchParcelDataRequest,
  fetchParcelsRequest
} from 'modules/parcels/actions'
import { buildCoordinate } from 'lib/utils'
import { inBounds } from 'lib/parcelUtils'

export function* mapSaga() {
  yield takeEvery(CHANGE_RANGE, handleChangeRange)
  yield takeEvery(HOVER_PARCEL, handleHoverParcel)
}

function* handleChangeRange(action) {
  const { nw, se } = action
  yield put(fetchParcelsRequest(nw, se))
}

function* handleHoverParcel(action) {
  const { x, y } = action
  if (!inBounds(x, y)) return
  const parcels = yield select(getParcels)
  const parcel = parcels[buildCoordinate(x, y)]
  if (!parcel || !parcel.owner) return // only fetch data if the parcel is loaded and has an owner
  yield put(fetchParcelDataRequest(x, y))
}
