// Fetch Transaction

export const FETCH_TRANSACTION_REQUEST = '[Request] Fetch Transaction'
export const FETCH_TRANSACTION_SUCCESS = '[Success] Fetch Transaction'
export const FETCH_TRANSACTION_FAILURE = '[Failure] Fetch Transaction'

export function fetchTransactionRequest(address, hash, action) {
  return {
    type: FETCH_TRANSACTION_REQUEST,
    address,
    hash,
    action
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

// Watch transactions

export const WATCH_LOADING_TRANSACTIONS = 'Watch loading transactions'

export function watchLoadingTransactions() {
  return {
    type: WATCH_LOADING_TRANSACTIONS
  }
}
