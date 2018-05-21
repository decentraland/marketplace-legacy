import { takeEvery, put } from 'redux-saga/effects'
import {
  CREATE_ESTATE_REQUEST,
  createEstateSuccess,
  createEstateFailure
} from './actions'
import { inBounds } from 'lib/parcelUtils'

export function* estateSaga() {
  yield takeEvery(CREATE_ESTATE_REQUEST, handleCreateEstateRequest)
}

function validateCoords(x, y) {
  if (!inBounds(x, y)) {
    throw new Error(`Coords (${x}, ${y}) are outside of the valid bounds`)
  }
}

function* handleCreateEstateRequest(action) {
  const { estate } = action
  try {
    estate.parcels.forEach(coords => validateCoords)
    // call estate contract

    yield put(createEstateSuccess('randomTxHash', estate))
  } catch (error) {
    console.warn(error)
    yield put(createEstateFailure(estate, error.message))
  }
}
