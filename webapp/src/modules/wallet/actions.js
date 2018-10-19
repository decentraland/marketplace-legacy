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
