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

// Transfer MANA

export const TRANSFER_MANA_REQUEST = '[Request] Transfer MANA'
export const TRANSFER_MANA_SUCCESS = '[Success] Transfer MANA'
export const TRANSFER_MANA_FAILURE = '[Failure] Transfer MANA'

export function transferManaRequest(address, mana) {
  return {
    type: TRANSFER_MANA_REQUEST,
    address,
    mana
  }
}

export function transferManaSuccess(txHash, address, mana) {
  return {
    type: TRANSFER_MANA_SUCCESS,
    ...buildTransactionAction(txHash, { address, mana }),
    address,
    mana
  }
}

export function transferManaFailure(error) {
  return {
    type: TRANSFER_MANA_FAILURE,
    error
  }
}

// Update derivation path

export const UPDATE_DERIVATION_PATH = 'Update derivation path'

export function updateDerivationPath(derivationPath) {
  return {
    type: UPDATE_DERIVATION_PATH,
    derivationPath
  }
}

// Clear error

export const CLEAR_WALLET_ERROR = 'Clear Wallet Error'

// Buy MANA

export const BUY_MANA_REQUEST = '[Request] Buy MANA'
export const BUY_MANA_SUCCESS = '[Success] Buy MANA'
export const BUY_MANA_FAILURE = '[Failure] Buy MANA'

export function buyManaRequest(mana, tx) {
  return {
    type: BUY_MANA_REQUEST,
    mana,
    tx
  }
}

export function buyManaSuccess(txHash, mana) {
  return {
    type: BUY_MANA_SUCCESS,
    ...buildTransactionAction(txHash, { mana }),
    mana
  }
}

export function buyManaFailure(error) {
  return {
    type: BUY_MANA_FAILURE,
    error
  }
}

// Update Balance

export const UPDATE_BALANCE = 'Update Balance'

export function updateBalance(balance) {
  return {
    type: UPDATE_BALANCE,
    balance
  }
}

// Update ETH Balance

export const UPDATE_ETH_BALANCE = 'Update ETH Balance'

export function updateEthBalance(ethBalance) {
  return {
    type: UPDATE_ETH_BALANCE,
    ethBalance
  }
}

// Approve Mortgage for MANA

export const APPROVE_MORTGAGE_FOR_MANA_REQUEST =
  '[Request] Approve Mortgage for MANA'
export const APPROVE_MORTGAGE_FOR_MANA_SUCCESS =
  '[Success] Approve Mortgage for MANA'
export const APPROVE_MORTGAGE_FOR_MANA_FAILURE =
  '[Failure] Approve Mortgage for MANA'

export function approveMortgageForManaRequest(mana) {
  return {
    type: APPROVE_MORTGAGE_FOR_MANA_REQUEST,
    mana
  }
}

export function approveMortgageForManaSuccess(txHash, mana) {
  return {
    type: APPROVE_MORTGAGE_FOR_MANA_SUCCESS,
    ...buildTransactionAction(txHash, { mana }),
    mana
  }
}

export function approveMortgageForManaFailure(error) {
  return {
    type: APPROVE_MORTGAGE_FOR_MANA_FAILURE,
    error
  }
}

// Approve Mortgage for RCN

export const APPROVE_MORTGAGE_FOR_RCN_REQUEST =
  '[Request] Approve Mortgage for RCN'
export const APPROVE_MORTGAGE_FOR_RCN_SUCCESS =
  '[Success] Approve Mortgage for RCN'
export const APPROVE_MORTGAGE_FOR_RCN_FAILURE =
  '[Failure] Approve Mortgage for RCN'

export function approveMortgageForRCNRequest(rcn) {
  return {
    type: APPROVE_MORTGAGE_FOR_RCN_REQUEST,
    rcn
  }
}

export function approveMortgageForRCNSuccess(txHash, rcn) {
  return {
    type: APPROVE_MORTGAGE_FOR_RCN_SUCCESS,
    ...buildTransactionAction(txHash, { rcn }),
    rcn
  }
}

export function approveMortgageForRCNFailure(error) {
  return {
    type: APPROVE_MORTGAGE_FOR_RCN_FAILURE,
    error
  }
}
