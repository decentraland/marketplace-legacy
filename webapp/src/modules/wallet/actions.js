export const FETCH_WALLET_REQUEST = '[Request] Wallet fetch requested'
export const FETCH_WALLET_SUCCESS = '[Success] Wallet fetched'
export const FETCH_WALLET_FAILURE = '[Failure] Failure to fetch wallet'

export function fetchWallet() {
  return {
    type: FETCH_WALLET_REQUEST
  }
}
