import { buildTransactionAction } from 'modules/transaction/utils'

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

// Set new parcel owner

export const SET_ON_CHAIN_PARCEL_OWNER = 'Set on-chain parcel owner'

export function setParcelOnChainOwner(parcelId, owner) {
  return {
    type: SET_ON_CHAIN_PARCEL_OWNER,
    parcelId,
    owner
  }
}

// Change the auction center

export const CHANGE_AUCTION_CENTER_PARCEL = 'Change auction center parcel'

export function changeAuctionCenterParcel(parcel) {
  return {
    type: CHANGE_AUCTION_CENTER_PARCEL,
    parcel
  }
}

// Bid parcels

export const BID_ON_PARCELS_REQUEST = '[Request] Bid on parcels'
export const BID_ON_PARCELS_SUCCESS = '[Success] Bid on parcels'
export const BID_ON_PARCELS_FAILURE = '[Failure] Bid on parcels'

export function bidOnParcelsRequest(parcels, beneficiary) {
  return {
    type: BID_ON_PARCELS_REQUEST,
    parcels,
    beneficiary
  }
}

export function bidOnParcelsSuccess(txHash, xs, ys, beneficiary, params) {
  return {
    type: BID_ON_PARCELS_SUCCESS,
    ...buildTransactionAction(txHash, {
      xs,
      ys,
      beneficiary
    }),
    xs,
    ys,
    beneficiary,
    params
  }
}

export function bidOnParcelsFailure(error) {
  return {
    type: BID_ON_PARCELS_FAILURE,
    error
  }
}

// Fetch auction rate

export const FETCH_AUCTION_RATE_REQUEST = '[Request] Fetch auction rate'
export const FETCH_AUCTION_RATE_SUCCESS = '[Success] Fetch auction rate'
export const FETCH_AUCTION_RATE_FAILURE = '[Failure] Fetch auction rate'

export function fetchAuctionRateRequest(token) {
  return {
    type: FETCH_AUCTION_RATE_REQUEST,
    token
  }
}

export function fetchAuctionRateSuccess(token, rate) {
  return {
    type: FETCH_AUCTION_RATE_SUCCESS,
    token,
    rate
  }
}

export function fetchAuctionRateFailure(token, error) {
  return {
    type: FETCH_AUCTION_RATE_FAILURE,
    token,
    error
  }
}

// Fetch auction price

export const FETCH_AUCTION_PRICE_REQUEST = '[Request] Fetch auction price'
export const FETCH_AUCTION_PRICE_SUCCESS = '[Success] Fetch auction price'
export const FETCH_AUCTION_PRICE_FAILURE = '[Failure] Fetch auction price'

export function fetchAuctionPriceRequest() {
  return {
    type: FETCH_AUCTION_PRICE_REQUEST
  }
}

export function fetchAuctionPriceSuccess(price) {
  return {
    type: FETCH_AUCTION_PRICE_SUCCESS,
    price
  }
}

export function fetchAuctionPriceFailure(error) {
  return {
    type: FETCH_AUCTION_PRICE_FAILURE,
    error
  }
}

// Set selecteted coordinates

export const SET_SELECTED_COORDINATES = 'Set selected coordinates'

export function setSelectedCoordinates(selectedCoordinatesById) {
  return {
    type: SET_SELECTED_COORDINATES,
    selectedCoordinatesById
  }
}

// Click `learn more` on the auction

export const LEARN_MORE_AUCTION = 'Learn more auction'

export function learnMoreAuction() {
  return {
    type: LEARN_MORE_AUCTION
  }
}
