import { buildTransactionAction } from 'modules/transaction/utils'
import { splitCoordinate } from 'lib/utils'

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
  const { x, y } = splitCoordinate(assetId)
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

export function fetchMortgagedParcelsSuccess(parcels, mortgages) {
  return {
    type: FETCH_MORTGAGED_PARCELS_SUCCESS,
    parcels,
    mortgages
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
export const PAY_MORTGAGE_SUCCESS = '[Success] Pay mortgages'
export const PAY_MORTGAGE_FAILURE = '[Failure] Pay mortgages'

export function payMortgageRequest({loanId, amount}) {
  return {
    type: PAY_MORTGAGE_REQUEST,
    loanId,
    amount
  }
}

export function payMortgageSuccess(txHash) {
  return {
    type: PAY_MORTGAGE_SUCCESS,
    txHash
  }
}

export function payMortgageFailure(error) {
  return {
    type: PAY_MORTGAGE_FAILURE,
    error
  }
}
