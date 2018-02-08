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

// Approve Mana

export const APPROVE_MANA_REQUEST = '[Request] Approve mana'
export const APPROVE_MANA_SUCCESS = '[Success] Approve mana'
export const APPROVE_MANA_FAILURE = '[Failure] Approve mana'

export function approveManaRequest(mana) {
  return {
    type: APPROVE_MANA_REQUEST,
    mana
  }
}

export function approveManaSuccess(mana, txHash) {
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
