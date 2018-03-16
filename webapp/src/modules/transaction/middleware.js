import { fetchTransactionRequest } from './actions'
import { isTransactionAction, getTransactionHashFromAction } from './utils'
import { getAddress } from 'modules/wallet/selectors'

export function createTransactionMiddleware() {
  return store => next => action => {
    if (isTransactionAction(action)) {
      const address = getAddress(store.getState())
      const hash = getTransactionHashFromAction(action)

      store.dispatch(fetchTransactionRequest(address, hash, action))
    }

    return next(action)
  }
}
