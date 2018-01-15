export const FETCH_WALLET_REQUEST = '[Request] Wallet fetch requested'
export const FETCH_WALLET_SUCCESS = '[Success] Wallet fetched'
export const FETCH_WALLET_FAILURE = '[Failure] Failure to fetch wallet'

export const FETCH_BALANCE_REQUEST = '[Request] Balance fetch requested'
export const FETCH_BALANCE_SUCCESS = '[Success] Balance fetched'
export const FETCH_BALANCE_FAILURE = '[Failure] Failure to fetch balance'

export function fetchWallet() {
  return {
    type: FETCH_WALLET_REQUEST
  }
}

export function fetchBalance() {
  return {
    type: FETCH_BALANCE_REQUEST
  }
}
