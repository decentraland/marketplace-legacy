import { takeEvery, select, call, put } from 'redux-saga/effects'
import { eth } from 'decentraland-commons'
import { LANDRegistry } from 'decentraland-commons/dist/contracts/LANDRegistry'
import {
  FETCH_PARCELS_REQUEST,
  EDIT_PARCEL_REQUEST,
  fetchParcelsSuccess,
  fetchParcelsFailure,
  editParcelSuccess,
  editParcelFailure
} from './actions'
import { api } from 'lib/api'
import { getParcels } from './reducer'
import { buildCoordinate } from 'lib/utils'

export function* parcelsSaga() {
  yield takeEvery(FETCH_PARCELS_REQUEST, handleParcelsRequest)
  yield takeEvery(EDIT_PARCEL_REQUEST, handleEditParcelsRequest)
}

function* handleParcelsRequest(action) {
  try {
    const nw = buildCoordinate(action.nw.x, action.nw.y)
    const se = buildCoordinate(action.se.x, action.se.y)
    const parcels = yield call(() => api.fetchParcels(nw, se))

    yield put(fetchParcelsSuccess(parcels))
  } catch (error) {
    yield put(fetchParcelsFailure(error.message))
  }
}

function* handleEditParcelsRequest(action) {
  const parcel = action.parcel
  const { x, y, data } = parcel

  const parcels = yield select(getParcels)
  const currentParcel = parcels[buildCoordinate(x, y)]

  try {
    const contract = eth.getContract('LANDRegistry')
    const dataString = LANDRegistry.encodeLandData(data)
    yield call(() => contract.updateLandData(x, y, dataString))

    yield put(editParcelSuccess(parcel))
  } catch (error) {
    yield put(editParcelFailure(currentParcel, error.message))
  }
}
