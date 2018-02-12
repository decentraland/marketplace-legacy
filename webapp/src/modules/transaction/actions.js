// Fetch Transaction

export const FETCH_TRANSACTION_REQUEST = '[Request] Fetch Transaction'
export const FETCH_TRANSACTION_SUCCESS = '[Success] Fetch Transaction'
export const FETCH_TRANSACTION_FAILURE = '[Failure] Fetch Transaction'

export function fetchTransactionRequest(actionRef) {
  return {
    type: FETCH_TRANSACTION_REQUEST,
    actionRef
  }
}

export function fetchTransactionSuccess(transaction) {
  return {
    type: FETCH_TRANSACTION_SUCCESS,
    transaction
  }
}

export function fetchTransactionFailure(transaction, error) {
  return {
    type: FETCH_TRANSACTION_FAILURE,
    transaction,
    error
  }
}
