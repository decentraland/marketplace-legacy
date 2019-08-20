import {
  buildTransactionAction,
  buildTransactionWithReceiptAction
} from 'modules/transaction/utils'

// Place a bid for an asset

export const BID_REQUEST = '[Request] Bid Asset'
export const BID_SUCCESS = '[Success] Bid Asset'
export const BID_FAILURE = '[Failure] Bid Asset'

export function bidRequest(bid) {
  return {
    type: BID_REQUEST,
    bid
  }
}

export function bidSuccess(txHash, bid, asset) {
  return {
    type: BID_SUCCESS,
    ...buildTransactionWithReceiptAction(txHash, {
      price: bid.price,
      bidder: bid.bidder,
      expires_at: bid.expires_at,
      ...asset
    }),
    bid
  }
}

export function bidFailure(error) {
  return {
    type: BID_FAILURE,
    error
  }
}

// Accept a bid for an asset

export const ACCEPT_BID_REQUEST = '[Request] Accept Asset Bid'
export const ACCEPT_BID_SUCCESS = '[Success] Accept Asset Bid'
export const ACCEPT_BID_FAILURE = '[Failure] Accept Asset Bid'

export function acceptBidRequest(bid = {}) {
  return {
    type: ACCEPT_BID_REQUEST,
    bid
  }
}

export function acceptBidSuccess(txHash, bid, asset) {
  return {
    type: ACCEPT_BID_SUCCESS,
    ...buildTransactionAction(txHash, {
      bidId: bid.id,
      price: bid.price,
      bidder: bid.bidder,
      ...asset
    }),
    bid
  }
}

export function acceptBidFailure(error) {
  return {
    type: ACCEPT_BID_FAILURE,
    error
  }
}

// Cancel LAND Bid

export const CANCEL_BID_REQUEST = '[Request] Cancel Asset Bid'
export const CANCEL_BID_SUCCESS = '[Success] Cancel Asset Bid'
export const CANCEL_BID_FAILURE = '[Failure] Cancel Asset Bid'

export function cancelBidRequest(bid) {
  return {
    type: CANCEL_BID_REQUEST,
    bid
  }
}

export function cancelBidSuccess(txHash, bid, asset) {
  return {
    type: CANCEL_BID_SUCCESS,
    ...buildTransactionAction(txHash, {
      bidId: bid.id,
      ...asset
    }),
    bid
  }
}

export function cancelBidFailure(error) {
  return {
    type: CANCEL_BID_FAILURE,
    error
  }
}

// Fetch Asset Bid

export const FETCH_ASSET_BID_REQUEST = '[Request] Fetch Asset Bid'
export const FETCH_ASSET_BID_SUCCESS = '[Success] Fetch Asset Bid'
export const FETCH_ASSET_BID_FAILURE = '[Failure] Fetch Asset Bid'

export function fetchBidByAssetRequest(assetId, assetType, status) {
  return {
    type: FETCH_ASSET_BID_REQUEST,
    assetId,
    assetType,
    status
  }
}

export function fetchBidByAssetSuccess(bid) {
  return {
    type: FETCH_ASSET_BID_SUCCESS,
    bid
  }
}

export function fetchBidByAssetFailure(error) {
  return {
    type: FETCH_ASSET_BID_FAILURE,
    error
  }
}

// Fetch Asset Bids

export const FETCH_ASSET_BIDS_REQUEST = '[Request] Fetch Asset Bids'
export const FETCH_ASSET_BIDS_SUCCESS = '[Success] Fetch Asset Bids'
export const FETCH_ASSET_BIDS_FAILURE = '[Failure] Fetch Asset Bids'

export function fetchBidsByAssetRequest(assetId, assetType, status) {
  return {
    type: FETCH_ASSET_BIDS_REQUEST,
    assetId,
    assetType,
    status
  }
}

export function fetchBidsByAssetSuccess(bids) {
  return {
    type: FETCH_ASSET_BIDS_SUCCESS,
    bids
  }
}

export function fetchBidsByAssetFailure(error) {
  return {
    type: FETCH_ASSET_BIDS_FAILURE,
    error
  }
}

// Fetch Bid

export const FETCH_BID_REQUEST = '[Request] Fetch Bid'
export const FETCH_BID_SUCCESS = '[Success] Fetch Bid'
export const FETCH_BID_FAILURE = '[Failure] Fetch Bid'

export function fetchBidByIdRequest(bidId) {
  return {
    type: FETCH_BID_REQUEST,
    bidId
  }
}

export function fetchBidByIdSuccess(bid) {
  return {
    type: FETCH_BID_SUCCESS,
    bid
  }
}

export function fetchBidByIdFailure(error) {
  return {
    type: FETCH_BID_FAILURE,
    error
  }
}

// Fetch asset accepted Bid

export const FETCH_ASSET_ACCEPTED_BIDS_REQUEST =
  '[Request] Fetch Asset Accepted Bids'
export const FETCH_ASSET_ACCEPTED_BIDS_SUCCESS =
  '[Success] Fetch Asset Accepted Bids'
export const FETCH_ASSET_ACCEPTED_BIDS_FAILURE =
  '[Failure] Fetch Asset Accepted Bids'

export function fetchAssetAcceptedBidsRequest(asset, assetType) {
  return {
    type: FETCH_ASSET_ACCEPTED_BIDS_REQUEST,
    asset,
    assetType
  }
}

export function fetchAssetAcceptedBidsSuccess(bids) {
  return {
    type: FETCH_ASSET_ACCEPTED_BIDS_SUCCESS,
    bids
  }
}

export function fetchAssetAcceptedBidsFailure(error) {
  return {
    type: FETCH_ASSET_ACCEPTED_BIDS_FAILURE,
    error
  }
}
