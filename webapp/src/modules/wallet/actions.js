// Connect Wallet

export const CONNECT_WALLET_REQUEST = '[Request] Connect Wallet'
export const CONNECT_WALLET_SUCCESS = '[Success] Connect Wallet'
export const CONNECT_WALLET_FAILURE = '[Failure] Connect Wallet'

export function connectWalletRequest() {
  return {
    type: CONNECT_WALLET_REQUEST
  }
}

export function connectWalletSuccess(wallet) {
  return {
    type: CONNECT_WALLET_SUCCESS,
    wallet
  }
}

export function connectWalletFailure(error) {
  return {
    type: CONNECT_WALLET_FAILURE,
    error
  }
}

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
