export const FETCH_DISTRICTS_REQUEST = '[Request] Districts fetch requested'
export const FETCH_DISTRICTS_SUCCESS = '[Success] Districts fetched'
export const FETCH_DISTRICTS_FAILURE = '[Failure] Failure to fetch districts'

export function fetchDistricts() {
  return {
    type: FETCH_DISTRICTS_REQUEST
  }
}
