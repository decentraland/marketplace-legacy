import { takeEvery, call, put } from 'redux-saga/effects'
import { eth } from 'decentraland-commons'
import {
  FETCH_PARCELS_REQUEST,
  FETCH_PARCELS_SUCCESS,
  FETCH_PARCELS_FAILURE,
  EDIT_PARCEL_REQUEST,
  EDIT_PARCEL_SUCCESS,
  EDIT_PARCEL_FAILURE
} from './actions'
import api from 'lib/api'
import { buildCoordinate } from 'lib/utils'

export default function* saga() {
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
  try {
    const parcel = action.parcel
    const payload = `Decentraland Marketplace: Editing parcel (${Date.now()})
x: ${parcel.x}
y: ${parcel.y}
name: ${parcel.name}
description: ${parcel.description}`

    const { message, signature } = yield call(() => eth.sign(payload))

    yield call(() => api.editParcel(message, signature))

    yield put({ type: EDIT_PARCEL_SUCCESS, parcel })
  } catch (error) {
    console.warn(error)
    yield put({ type: EDIT_PARCEL_FAILURE, error: error.message })
  }
}
