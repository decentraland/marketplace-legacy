// Fetch Dashboard Stats

export const FETCH_DASHBOARD_STATS_REQUEST = '[Request] Fetch Dashboard Stats'
export const FETCH_DASHBOARD_STATS_SUCCESS = '[Success] Fetch Dashboard Stats'
export const FETCH_DASHBOARD_STATS_FAILURE = '[Failure] Fetch Dashboard Stats'

export function fetchDashboardStatsRequest() {
  return {
    type: FETCH_DASHBOARD_STATS_REQUEST
  }
}

export function fetchDashboardStatsSuccess(stats) {
  return {
    type: FETCH_DASHBOARD_STATS_SUCCESS,
    stats
  }
}

export function fetchDashboardStatsFailure(error) {
  return {
    type: FETCH_DASHBOARD_STATS_FAILURE,
    error
  }
}
