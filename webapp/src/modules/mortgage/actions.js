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
