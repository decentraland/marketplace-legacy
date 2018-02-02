import { takeEvery, select, all, call, put } from 'redux-saga/effects'
import { eth } from 'decentraland-commons'
import { LANDRegistry } from 'decentraland-commons/dist/contracts/LANDRegistry'
import {
  FETCH_PARCELS_REQUEST,
  FETCH_PARCELS_SUCCESS,
  FETCH_PARCELS_FAILURE,
  FETCH_PARCEL_REQUEST,
  FETCH_PARCEL_SUCCESS,
  FETCH_PARCEL_FAILURE,
  FETCH_PARCEL_DATA_REQUEST,
  FETCH_PARCEL_DATA_SUCCESS,
  FETCH_PARCEL_DATA_FAILURE,
  EDIT_PARCEL_REQUEST,
  EDIT_PARCEL_SUCCESS,
  EDIT_PARCEL_FAILURE
} from './actions'
import { api } from 'lib/api'
import { getParcels } from './reducer'
import { buildCoordinate } from 'lib/utils'
import { inBounds } from 'lib/parcelUtils'

export function* parcelsSaga() {
  yield takeEvery(FETCH_PARCELS_REQUEST, handleParcelsRequest)
  yield takeEvery(FETCH_PARCEL_REQUEST, handleParcelRequest)
  yield takeEvery(FETCH_PARCEL_DATA_REQUEST, handleParcelDataRequest)
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

function* handleParcelRequest(action) {
  try {
    const { x, y } = action
    const nw = buildCoordinate(x, y)
    const se = buildCoordinate(x, y)

    let [parcels, data] = yield all([
      api.fetchParcels(nw, se),
      api.fetchParcelData(x, y)
    ])

    parcels = parcels.map(parcel => Object.assign(parcel, { data }))

    yield put({
      type: FETCH_PARCEL_SUCCESS,
      parcels
    })
  } catch (error) {
    console.warn(error)
    yield put({
      type: FETCH_PARCEL_FAILURE,
      error: error.message
    })
  }
}

function* handleParcelDataRequest(action) {
  try {
    const { x, y } = action
    if (!inBounds(x, y)) {
      throw new Error(`Coords (${x}, ${y}) are outside of the valid bounds`)
    }

    const parcels = yield select(getParcels)
    const parcel = parcels[buildCoordinate(x, y)]
    if (!parcel) {
      throw new Error(`Parcel (${x}, ${y}) is not in the state:`, parcels)
    }

    const data = yield call(() => api.fetchParcelData(x, y))
    const newParcel = { ...parcel, data }

    yield put({
      type: FETCH_PARCEL_DATA_SUCCESS,
      parcels: [newParcel]
    })
  } catch (error) {
    console.warn(error)
    yield put({
      type: FETCH_PARCEL_DATA_FAILURE,
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
