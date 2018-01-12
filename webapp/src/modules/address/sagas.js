import { takeEvery, call, put } from 'redux-saga/effects'
import {
  FETCH_ADDRESS_PARCELS_REQUEST,
  FETCH_ADDRESS_PARCELS_SUCCESS,
  FETCH_ADDRESS_PARCELS_FAILURE,
  FETCH_ADDRESS_CONTRIBUTIONS_REQUEST,
  FETCH_ADDRESS_CONTRIBUTIONS_SUCCESS,
  FETCH_ADDRESS_CONTRIBUTIONS_FAILURE
} from './actions'

import { FETCH_PARCELS_SUCCESS } from 'modules/parcels/actions'

import api from 'lib/api'

export default function* saga() {
  yield takeEvery(FETCH_ADDRESS_PARCELS_REQUEST, handleAddressParcelsRequest)
  yield takeEvery(FETCH_ADDRESS_PARCELS_SUCCESS, handleAddressParcelsSuccess)
  yield takeEvery(
    FETCH_ADDRESS_CONTRIBUTIONS_REQUEST,
    handleAddressContributionsRequest
  )
}

function* handleAddressParcelsRequest(action) {
  try {
    const { address } = action
    const parcels = yield call(() => api.fetchAddressParcels(address))

    yield put({
      type: FETCH_ADDRESS_PARCELS_SUCCESS,
      address,
      parcels
    })
  } catch (error) {
    yield put({
      type: FETCH_ADDRESS_PARCELS_FAILURE,
      error: error.message
    })
  }
}

function* handleAddressParcelsSuccess(action) {
  yield put({
    type: FETCH_PARCELS_SUCCESS,
    parcels: action.parcels
  })
}

function* handleAddressContributionsRequest(action) {
  try {
    const { address } = action
    let contributions = yield call(() => api.fetchAddressContributions(address))

    contributions = [
      {
        id: 2,
        address: '0xec6e6c0841a2ba474e92bf42baf76bfe80e8657c',
        district_id: '219ac351-e6ce-4e17-8b84-eb008afddf69',
        land_count: 6,
        timestamp: '1507144067874'
      }
    ]

    yield put({
      type: FETCH_ADDRESS_CONTRIBUTIONS_SUCCESS,
      address,
      contributions
    })
  } catch (error) {
    yield put({
      type: FETCH_ADDRESS_CONTRIBUTIONS_FAILURE,
      error: error.message
    })
  }
}
