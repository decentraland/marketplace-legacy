import { buildTransactionAction } from 'modules/transaction/utils'

export const CREATE_MORTGAGE_REQUEST = '[Request] Create Mortgage'
export const CREATE_MORTGAGE_SUCCESS = '[Success] Create Mortgage'
export const CREATE_MORTGAGE_FAILURE = '[Failure] Create Mortgage'

export function createMortgageRequest(params) {
  return {
    type: CREATE_MORTGAGE_REQUEST,
    ...params
  }
}

export function createMortgageSuccess(txHash, { x, y }) {
  return {
    type: CREATE_MORTGAGE_SUCCESS,
    ...buildTransactionAction(txHash, {
      tx_hash: txHash,
      x,
      y
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

export function cancelMortgageRequest(mortgageId, { x, y }) {
  return {
    type: CANCEL_MORTGAGE_REQUEST,
    mortgageId,
    x,
    y
  }
}

export function cancelMortgageSuccess(txHash, { x, y }) {
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

export function fetchMortgagedParcelsSuccess(parcels) {
  return {
    type: FETCH_MORTGAGED_PARCELS_SUCCESS,
    payload: parcels
  }
}

export function fetchMortgagedParcelsFailure(error) {
  return {
    type: FETCH_MORTGAGED_PARCELS_FAILURE,
    error
  }
}
