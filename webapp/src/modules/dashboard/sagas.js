import { takeEvery, call, put } from 'redux-saga/effects'
import {
  FETCH_DASHBOARD_STATS_REQUEST,
  fetchDashboardStatsSuccess,
  fetchDashboardStatsFailure
} from './actions'
import { api } from 'lib/api'

export function* dashboardSaga() {
  yield takeEvery(FETCH_DASHBOARD_STATS_REQUEST, handleDashboardStatsRequest)
}

function* handleDashboardStatsRequest(action) {
  try {
    const stats = yield call(() => api.fetchDashboardStats())
    yield put(fetchDashboardStatsSuccess(stats))
  } catch (error) {
    yield put(fetchDashboardStatsFailure(error.message))
  }
}
