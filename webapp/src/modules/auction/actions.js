// Fetch auction parameters

export const FETCH_AUCTION_PARAMS_REQUEST = '[Request] Fetch auction params'
export const FETCH_AUCTION_PARAMS_SUCCESS = '[Success] Fetch auction params'
export const FETCH_AUCTION_PARAMS_FAILURE = '[Failure] Fetch auction params'

export function fetchAuctionParamsRequest() {
  return {
    type: FETCH_AUCTION_PARAMS_REQUEST
  }
}

export function fetchAuctionParamsSuccess(params) {
  return {
    type: FETCH_AUCTION_PARAMS_SUCCESS,
    params
  }
}

export function fetchAuctionParamsFailure(error) {
  return {
    type: FETCH_AUCTION_PARAMS_FAILURE,
    error
  }
}
