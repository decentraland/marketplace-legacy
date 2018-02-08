import { utils } from 'decentraland-commons'

// Special flag used to determine transaction hashes to be monitored
const TRANSACTION_ACTION_FLAG = 'watch_tx'

export function isTransactionAction(action) {
  return !!getTransactionFromAction(action)
}

export function getTransactionFromAction(action) {
  return action[TRANSACTION_ACTION_FLAG]
}

export function getTransactionHashFromAction(action) {
  return getTransactionFromAction(action).hash
}

export function omitTransactionFromAction(action) {
  return utils.omit(action, TRANSACTION_ACTION_FLAG)
}

export function buildTransactionAction(hash, payload = {}, events = []) {
  return {
    [TRANSACTION_ACTION_FLAG]: {
      hash,
      payload,
      events
    }
  }
}
