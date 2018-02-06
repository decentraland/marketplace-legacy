// Fetch Districts

export const FETCH_DISTRICTS_REQUEST = '[Request] Fetch Districts'
export const FETCH_DISTRICTS_SUCCESS = '[Success] Fetch Districts'
export const FETCH_DISTRICTS_FAILURE = '[Failure] Fetch Districts'

export function fetchDistrictsRequest() {
  return {
    type: FETCH_DISTRICTS_REQUEST
  }
}

export function fetchDistrictsSuccess(districts) {
  return {
    type: FETCH_DISTRICTS_SUCCESS,
    districts
  }
}

export function fetchDistrictsFailure(error) {
  return {
    type: FETCH_DISTRICTS_FAILURE,
    error
  }
}
