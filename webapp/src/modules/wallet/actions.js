import { buildTransactionAction } from 'modules/transaction/utils'

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

// Approve MANA

export const APPROVE_MANA_REQUEST = '[Request] Approve MANA'
export const APPROVE_MANA_SUCCESS = '[Success] Approve MANA'
export const APPROVE_MANA_FAILURE = '[Failure] Approve MANA'

export function approveManaRequest(mana) {
  return {
    type: APPROVE_MANA_REQUEST,
    mana
  }
}

export function approveManaSuccess(txHash, mana) {
  return {
    type: APPROVE_MANA_SUCCESS,
    ...buildTransactionAction(txHash, { mana }),
    mana
  }
}

export function approveManaFailure(error) {
  return {
    type: APPROVE_MANA_FAILURE,
    error
  }
}

// Authorize LAND

export const AUTHORIZE_LAND_REQUEST = '[Request] Authorize LAND'
export const AUTHORIZE_LAND_SUCCESS = '[Success] Authorize LAND'
export const AUTHORIZE_LAND_FAILURE = '[Failure] Authorize LAND'

export function authorizeLandRequest(isAuthorized) {
  return {
    type: AUTHORIZE_LAND_REQUEST,
    isAuthorized
  }
}

export function authorizeLandSuccess(txHash, isAuthorized) {
  return {
    type: AUTHORIZE_LAND_SUCCESS,
    ...buildTransactionAction(txHash, { isAuthorized }),
    isAuthorized
  }
}

export function authorizeLandFailure(error) {
  return {
    type: AUTHORIZE_LAND_FAILURE,
    error
  }
}
