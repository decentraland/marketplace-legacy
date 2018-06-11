import { buildTransactionAction } from 'modules/transaction/utils'
import { splitCoordinate } from 'shared/parcel'

export const CREATE_MORTGAGE_REQUEST = '[Request] Create Mortgage'
export const CREATE_MORTGAGE_SUCCESS = '[Success] Create Mortgage'
export const CREATE_MORTGAGE_FAILURE = '[Failure] Create Mortgage'

export function createMortgageRequest(params) {
  return {
    type: CREATE_MORTGAGE_REQUEST,
    ...params
  }
}

export function createMortgageSuccess(txHash, asset) {
  return {
    type: CREATE_MORTGAGE_SUCCESS,
    ...buildTransactionAction(txHash, {
      tx_hash: txHash,
      x: asset.x,
      y: asset.y
    })
  }
}

export function createMortgageFailure(error) {
  return {
    type: CREATE_MORTGAGE_FAILURE,
    error
  }
}

export const CANCEL_MORTGAGE_REQUEST = '[Request] Cancel Mortgage'
export const CANCEL_MORTGAGE_SUCCESS = '[Success] Cancel Mortgage'
export const CANCEL_MORTGAGE_FAILURE = '[Failure] Cancel Mortgage'

export function cancelMortgageRequest(mortgageId, assetId) {
  return {
    type: CANCEL_MORTGAGE_REQUEST,
    mortgageId,
    assetId
  }
}

export function cancelMortgageSuccess(txHash, assetId) {
  const [x, y] = splitCoordinate(assetId)
  return {
    type: CANCEL_MORTGAGE_SUCCESS,
    ...buildTransactionAction(txHash, {
      tx_hash: txHash,
      x,
      y
    })
  }
}

export function cancelMortgageFailure(error) {
  return {
    type: CANCEL_MORTGAGE_FAILURE,
    error
  }
}

export const FETCH_MORTGAGED_PARCELS_REQUEST =
  '[Request] Fetch Mortgaged Parcels'
export const FETCH_MORTGAGED_PARCELS_SUCCESS =
  '[Success] Fetch Mortgaged Parcels'
export const FETCH_MORTGAGED_PARCELS_FAILURE =
  '[Failure] Fetch Mortgaged Parcels'

export function fetchMortgagedParcelsRequest(borrower) {
  return {
    type: FETCH_MORTGAGED_PARCELS_REQUEST,
    borrower
  }
}

export function fetchMortgagedParcelsSuccess(parcels, mortgages, publications) {
  return {
    type: FETCH_MORTGAGED_PARCELS_SUCCESS,
    parcels,
    mortgages,
    publications
  }
}

export function fetchMortgagedParcelsFailure(error) {
  return {
    type: FETCH_MORTGAGED_PARCELS_FAILURE,
    error
  }
}

export const FETCH_ACTIVE_PARCEL_MORTGAGES_REQUEST =
  '[Request] Fetch active parcel mortgages'
export const FETCH_ACTIVE_PARCEL_MORTGAGES_SUCCESS =
  '[Success] Fetch active parcel mortgages'
export const FETCH_ACTIVE_PARCEL_MORTGAGES_FAILURE =
  '[Failure] Fetch active parcel mortgages'

export function fetchActiveParcelMortgagesRequest(x, y) {
  return {
    type: FETCH_ACTIVE_PARCEL_MORTGAGES_REQUEST,
    x,
    y
  }
}

export function fetchActiveParcelMortgagesSuccess(mortgages, x, y) {
  return {
    type: FETCH_ACTIVE_PARCEL_MORTGAGES_SUCCESS,
    mortgages,
    x,
    y
  }
}

export function fetchActiveParcelMortgagesFailure(error) {
  return {
    type: FETCH_ACTIVE_PARCEL_MORTGAGES_FAILURE,
    error
  }
}

export const PAY_MORTGAGE_REQUEST = '[Request] Pay mortgage'
export const PAY_MORTGAGE_SUCCESS = '[Success] Pay mortgage'
export const PAY_MORTGAGE_FAILURE = '[Failure] Pay mortgage'

export function payMortgageRequest({ loanId, assetId, amount }) {
  return {
    type: PAY_MORTGAGE_REQUEST,
    loanId,
    assetId,
    amount
  }
}

export function payMortgageSuccess(txHash, assetId, amount) {
  const [x, y] = splitCoordinate(assetId)
  return {
    type: PAY_MORTGAGE_SUCCESS,
    ...buildTransactionAction(txHash, {
      tx_hash: txHash,
      x: parseInt(x, 10),
      y: parseInt(y, 10),
      amount
    })
  }
}

export function payMortgageFailure(error) {
  return {
    type: PAY_MORTGAGE_FAILURE,
    error
  }
}

export const CLAIM_MORTGAGE_RESOLUTION_REQUEST =
  '[Request] Claim mortgage resolution'
export const CLAIM_MORTGAGE_RESOLUTION_SUCCESS =
  '[Success] Claim mortgage resolution'
export const CLAIM_MORTGAGE_RESOLUTION_FAILURE =
  '[Failure] Claim mortgage resolution'

export function claimMortgageResolutionRequest(loanId, assetId) {
  return {
    type: CLAIM_MORTGAGE_RESOLUTION_REQUEST,
    loanId,
    assetId
  }
}

export function claimMortgageResolutionSuccess(txHash, assetId) {
  const [x, y] = splitCoordinate(assetId)
  return {
    type: CLAIM_MORTGAGE_RESOLUTION_SUCCESS,
    ...buildTransactionAction(txHash, {
      tx_hash: txHash,
      x: parseInt(x, 10),
      y: parseInt(y, 10)
    })
  }
}

export function claimMortgageResolutionFailure(error) {
  return {
    type: CLAIM_MORTGAGE_RESOLUTION_FAILURE,
    error
  }
}
