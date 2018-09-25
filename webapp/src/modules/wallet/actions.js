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

// Approve Token

export const APPROVE_TOKEN_REQUEST = '[Request] Approve Token'
export const APPROVE_TOKEN_SUCCESS = '[Success] Approve Token'
export const APPROVE_TOKEN_FAILURE = '[Failure] Approve Token'

export function approveTokenRequest(
  amount,
  contractName,
  tokenContractName = null // optional
) {
  return {
    type: APPROVE_TOKEN_REQUEST,
    amount,
    contractName,
    tokenContractName
  }
}

export function approveTokenSuccess(
  txHash,
  amount,
  contractName,
  tokenContractName
) {
  return {
    type: APPROVE_TOKEN_SUCCESS,
    ...buildTransactionAction(txHash, {
      amount,
      contractName,
      tokenContractName
    }),
    amount,
    contractName,
    tokenContractName
  }
}

export function approveTokenFailure(error) {
  return {
    type: APPROVE_TOKEN_FAILURE,
    error
  }
}

// Authorize Token

export const AUTHORIZE_TOKEN_REQUEST = '[Request] Authorize Token'
export const AUTHORIZE_TOKEN_SUCCESS = '[Success] Authorize Token'
export const AUTHORIZE_TOKEN_FAILURE = '[Failure] Authorize Token'

export function authorizeTokenRequest(
  isAuthorized,
  contractName,
  tokenContractName = null // optional
) {
  return {
    type: AUTHORIZE_TOKEN_REQUEST,
    isAuthorized,
    contractName,
    tokenContractName
  }
}

export function authorizeTokenSuccess(
  txHash,
  isAuthorized,
  contractName,
  tokenContractName
) {
  return {
    type: AUTHORIZE_TOKEN_SUCCESS,
    ...buildTransactionAction(txHash, {
      isAuthorized,
      contractName,
      tokenContractName
    }),
    isAuthorized,
    contractName,
    tokenContractName
  }
}

export function authorizeTokenFailure(error) {
  return {
    type: AUTHORIZE_TOKEN_FAILURE,
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
