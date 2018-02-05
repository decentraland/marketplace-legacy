import { call, takeLatest, put } from 'redux-saga/effects'
import {
  FETCH_DISTRICTS_REQUEST,
  fetchDistrictsSuccess,
  fetchDistrictsFailure
} from './actions'
import { api } from 'lib/api'

export function* districtsSaga() {
  yield takeLatest(FETCH_DISTRICTS_REQUEST, handleDistrictsRequest)
}

function* handleDistrictsRequest(action) {
  try {
    const districts = yield call(() => api.fetchDistricts())
    yield put(fetchDistrictsSuccess(districts))
  } catch (error) {
    yield put(fetchDistrictsFailure(error.message))
  }
}
