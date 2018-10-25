import { buildTransactionAction } from 'modules/transaction/utils'

export * from '@dapps/modules/wallet/actions'

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

export const UPDATE_MANA_BALANCE = 'Update Mana Balance'

export function updateManaBalance(mana) {
  return {
    type: UPDATE_MANA_BALANCE,
    mana
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
