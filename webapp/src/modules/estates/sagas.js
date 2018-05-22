import { takeEvery, put } from 'redux-saga/effects'
import {
  CREATE_ESTATE_REQUEST,
  createEstateSuccess,
  createEstateFailure
} from './actions'
import { inBounds } from 'lib/parcelUtils'

function validateCoords(x, y) {
  if (!inBounds(x, y)) {
    throw new Error(`Coords (${x}, ${y}) are outside of the valid bounds`)
  }
}

// delete when estate contract returns an address
function randomString(length) {
  return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

function* handleCreateEstateRequest(action) {
  const { estate } = action
  try {
    estate.parcels.forEach(coords => validateCoords)
    // call estate contract
    const contractAddress = randomString(42)
    yield put(createEstateSuccess('randomTxHash', { ...estate, id: contractAddress }))
  } catch (error) {
    console.warn(error)
    yield put(createEstateFailure(estate, error.message))
  }
}

export function* estateSaga() {
  yield takeEvery(CREATE_ESTATE_REQUEST, handleCreateEstateRequest)
}
