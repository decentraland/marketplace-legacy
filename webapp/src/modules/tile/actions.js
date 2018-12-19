// Fetch Tiles

export const FETCH_TILES_REQUEST = '[Request] Fetch Tiles'
export const FETCH_TILES_SUCCESS = '[Success] Fetch Tiles'
export const FETCH_TILES_FAILURE = '[Failure] Fetch Tiles'

export function fetchTilesRequest(nw, se) {
  return {
    type: FETCH_TILES_REQUEST,
    nw,
    se
  }
}

export function fetchTilesSuccess(tiles) {
  return {
    type: FETCH_TILES_SUCCESS,
    tiles
  }
}

export function fetchTilesFailure() {
  return {
    type: FETCH_TILES_FAILURE
  }
}
