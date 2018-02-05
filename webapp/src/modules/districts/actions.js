export const FETCH_DISTRICTS_REQUEST = '[Request] Districts fetch requested'
export const FETCH_DISTRICTS_SUCCESS = '[Success] Districts fetched'
export const FETCH_DISTRICTS_FAILURE = '[Failure] Failure to fetch districts'

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
