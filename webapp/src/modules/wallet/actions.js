// Fetch Wallet

export const FETCH_WALLET_REQUEST = '[Request] Fetch Wallet'
export const FETCH_WALLET_SUCCESS = '[Success] Fetch Wallet'
export const FETCH_WALLET_FAILURE = '[Failure] Fetch Wallet'

export function fetchWalletRequest() {
  return {
    type: FETCH_WALLET_REQUEST
  }
}

export function fetchWalletSuccess(wallet) {
  return {
    type: FETCH_WALLET_SUCCESS,
    wallet
  }
}

export function fetchWalletFailure(error) {
  return {
    type: FETCH_WALLET_FAILURE,
    error
  }
}

// Fetch Balance

export const FETCH_BALANCE_REQUEST = '[Request] Fetch Balance'
export const FETCH_BALANCE_SUCCESS = '[Success] Fetch Balance'
export const FETCH_BALANCE_FAILURE = '[Failure] Fetch Balance'

export function fetchBalanceRequest() {
  return {
    type: FETCH_BALANCE_REQUEST
  }
}

export function fetchBalanceSuccess(wallet) {
  return {
    type: FETCH_BALANCE_SUCCESS,
    wallet
  }
}

export function fetchBalanceFailure(error) {
  return {
    type: FETCH_BALANCE_FAILURE,
    error
  }
}
