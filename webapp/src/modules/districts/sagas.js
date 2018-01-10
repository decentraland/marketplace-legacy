import { call, takeLatest, put } from 'redux-saga/effects'

import {
  FETCH_DISTRICTS_REQUEST,
  FETCH_DISTRICTS_SUCCESS,
  FETCH_DISTRICTS_FAILURE
} from './actions'

import api from 'lib/api'

export default function* saga() {
  yield takeLatest(FETCH_DISTRICTS_REQUEST, handleDistrictsRequest)
}

function* handleDistrictsRequest(action) {
  try {
    const districts = yield call(() => api.fetchDistricts())

    yield put({ type: FETCH_DISTRICTS_SUCCESS, districts })
  } catch (error) {
    yield put({ type: FETCH_DISTRICTS_FAILURE, message: error.message })
  }
}
