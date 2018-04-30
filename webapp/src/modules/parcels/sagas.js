import { takeEvery, select, call, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { eth, contracts } from 'decentraland-eth'
import {
  FETCH_PARCELS_REQUEST,
  FETCH_PARCEL_REQUEST,
  EDIT_PARCEL_REQUEST,
  fetchParcelSuccess,
  fetchParcelFailure,
  fetchParcelsSuccess,
  fetchParcelsFailure,
  editParcelSuccess,
  editParcelFailure
} from './actions'
import { getParcels } from './selectors'
import { locations } from 'locations'
import { api } from 'lib/api'
import { buildCoordinate } from 'lib/utils'
import { inBounds } from 'lib/parcelUtils'

export function* parcelsSaga() {
  yield takeEvery(FETCH_PARCELS_REQUEST, handleParcelsRequest)
  yield takeEvery(FETCH_PARCEL_REQUEST, handleParcelRequest)
  yield takeEvery(EDIT_PARCEL_REQUEST, handleEditParcelsRequest)
}

function* handleParcelsRequest(action) {
  try {
    const nw = buildCoordinate(action.nw.x, action.nw.y)
    const se = buildCoordinate(action.se.x, action.se.y)
    const { parcels } = yield call(() => api.fetchParcelsInRange(nw, se))

    yield put(fetchParcelsSuccess(parcels))
  } catch (error) {
    yield put(fetchParcelsFailure(error.message))
  }
}

function* handleParcelRequest(action) {
  const { x, y } = action
  try {
    const parcelId = buildCoordinate(x, y)
    const nw = parcelId
    const se = parcelId

    if (!inBounds(x, y)) {
      throw new Error(`Coords (${x}, ${y}) are outside of the valid bounds`)
    }

    const { parcels } = yield call(() => api.fetchParcelsInRange(nw, se))
    const parcel = parcels.find(p => p.id === parcelId)

    yield put(fetchParcelSuccess(x, y, parcel))
  } catch (error) {
    console.warn(error)
    yield put(fetchParcelFailure(x, y, error.message))
  }
}

function* handleEditParcelsRequest(action) {
  try {
    const parcel = action.parcel
    const { x, y, data } = parcel

    const contract = eth.getContract('LANDRegistry')
    const dataString = contracts.LANDRegistry.encodeLandData(data)
    const txHash = yield call(() => contract.updateLandData(x, y, dataString))

    yield put(editParcelSuccess(txHash, parcel))
    yield put(push(locations.activity))
  } catch (error) {
    const parcels = yield select(getParcels)
    const { x, y } = action.parcel
    const parcel = parcels[buildCoordinate(x, y)]
    yield put(editParcelFailure(parcel, error.message))
  }
}
