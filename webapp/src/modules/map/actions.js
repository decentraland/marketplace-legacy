// Fetch Map
export const FETCH_MAP_REQUEST = '[Request] Fetch Map'
export const FETCH_MAP_SUCCESS = '[Success] Fetch Map'
export const FETCH_MAP_FAILURE = '[Failure] Fetch Map'

export function fetchMapRequest(nw, se) {
  return {
    type: FETCH_MAP_REQUEST,
    nw,
    se
  }
}

export function fetchMapSuccess(map) {
  return {
    type: FETCH_MAP_SUCCESS,
    map
  }
}

export function fetchMapFailure() {
  return {
    type: FETCH_MAP_FAILURE
  }
}
