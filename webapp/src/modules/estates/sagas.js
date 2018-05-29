import { takeEvery, put, select, call } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import {
  CREATE_ESTATE_REQUEST,
  createEstateSuccess,
  createEstateFailure,
  FETCH_ESTATE_REQUEST,
  fetchEstateSuccess,
  fetchEstateFailure
} from './actions'
import { inBounds } from 'lib/parcelUtils'
import { getParcels } from 'modules/parcels/selectors'
import { locations } from 'locations'
import { api } from 'lib/api'

function validateCoords(x, y) {
  if (!inBounds(x, y)) {
    throw new Error(`Coords (${x}, ${y}) are outside of the valid bounds`)
  }
}

// delete when estate contract returns an address
function randomString(length) {
  return Math.round(
    Math.pow(36, length + 1) - Math.random() * Math.pow(36, length)
  )
    .toString(36)
    .slice(1)
}

function* handleCreateEstateRequest(action) {
  const { estate } = action
  try {
    estate.data.parcels.forEach(coords => validateCoords)
    // call estate contract
    const contractAddress = randomString(42)
    const txHash = randomString(42)
    const allParcels = yield select(getParcels)
    const { owner } = allParcels[
      `${estate.data.parcels[0].x},${estate.data.parcels[0].y}`
    ]

    yield put(
      createEstateSuccess(txHash, {
        ...estate,
        id: contractAddress,
        owner
      })
    )
    yield put(push(locations.activity))
  } catch (error) {
    console.warn(error)
    yield put(createEstateFailure(estate, error.message))
  }
}

function* handleEstateRequest(action) {
  const { id } = action
  try {
    const { estates } = yield call(() => api.fetchEstates())
    const estate = estates.find(e => e.id === id)
    yield put(fetchEstateSuccess(id, estate))
  } catch (error) {
    console.warn(error)
    yield put(fetchEstateFailure(id, error.message))
  }
}

export function* estateSaga() {
  yield takeEvery(CREATE_ESTATE_REQUEST, handleCreateEstateRequest)
  yield takeEvery(FETCH_ESTATE_REQUEST, handleEstateRequest)
}
