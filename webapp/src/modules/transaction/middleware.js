import { fetchTransactionRequest } from './actions'
import { isTransactionAction } from './utils'

export function createTransactionMiddleware() {
  return store => next => action => {
    if (isTransactionAction(action)) {
      store.dispatch(fetchTransactionRequest(action))
    }

    return next(action)
  }
}
