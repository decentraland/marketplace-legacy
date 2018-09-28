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
