import { takeEvery, select, call, put } from 'redux-saga/effects'
import { eth } from 'decentraland-commons'
import { LANDRegistry } from 'decentraland-commons/dist/contracts/LANDRegistry'
import {
  FETCH_PARCELS_REQUEST,
  FETCH_PARCELS_SUCCESS,
  FETCH_PARCELS_FAILURE,
  EDIT_PARCEL_REQUEST,
  EDIT_PARCEL_SUCCESS,
  EDIT_PARCEL_FAILURE
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

    yield put({
      type: FETCH_PARCELS_SUCCESS,
      parcels
    })
  } catch (error) {
    console.warn(error)
    yield put({
      type: FETCH_PARCELS_FAILURE,
      error: error.message
    })
  }
}

function* handleEditParcelsRequest(action) {
  const parcel = action.parcel
  const { x, y, data } = parcel

  try {
    const contract = eth.getContract('LANDRegistry')
    const dataString = LANDRegistry.encodeLandData(data)

    yield call(() => contract.updateLandData(x, y, dataString))

    yield put({ type: EDIT_PARCEL_SUCCESS, parcel })
  } catch (error) {
    console.warn(error)
    const parcels = yield select(getParcels)
    const currentParcel = parcels[buildCoordinate(x, y)]

    yield put({
      type: EDIT_PARCEL_FAILURE,
      error: error.message,
      parcel: currentParcel
    })
  }
}
