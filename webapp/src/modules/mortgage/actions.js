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

export function cancelMortgageRequest(mortgageId) {
  return {
    type: CANCEL_MORTGAGE_REQUEST,
    mortgageId
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
