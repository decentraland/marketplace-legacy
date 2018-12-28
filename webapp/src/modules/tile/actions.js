// Fetch Tiles

export const FETCH_TILES_REQUEST = '[Request] Fetch Tiles'
export const FETCH_TILES_SUCCESS = '[Success] Fetch Tiles'
export const FETCH_TILES_FAILURE = '[Failure] Fetch Tiles'

export function fetchTilesRequest() {
  return {
    type: FETCH_TILES_REQUEST
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

// Fetch Address Tiles

export const FETCH_ADDRESS_TILES_REQUEST = '[Request] Fetch Address Tiles'
export const FETCH_ADDRESS_TILES_SUCCESS = '[Success] Fetch Address Tiles'
export const FETCH_ADDRESS_TILES_FAILURE = '[Failure] Fetch Address Tiles'

export function fetchAddressTilesRequest(address) {
  return {
    type: FETCH_ADDRESS_TILES_REQUEST,
    address
  }
}

export function fetchAddressTilesSuccess(tiles) {
  return {
    type: FETCH_ADDRESS_TILES_SUCCESS,
    tiles
  }
}

export function fetchAddressTilesFailure() {
  return {
    type: FETCH_ADDRESS_TILES_FAILURE
  }
}
