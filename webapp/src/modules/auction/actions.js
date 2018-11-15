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

export function bidOnParcelsSuccess(txHash, xs, ys, beneficiary) {
  return {
    type: BID_ON_PARCELS_SUCCESS,
    ...buildTransactionAction(txHash, {
      parcelCount: xs.length
    }),
    xs,
    ys,
    beneficiary
  }
}

export function bidOnParcelsFailure(error) {
  return {
    type: BID_ON_PARCELS_FAILURE,
    error
  }
}
