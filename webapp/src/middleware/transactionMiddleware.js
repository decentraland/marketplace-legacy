import { fetchTransactionRequest } from 'modules/transaction/actions'
import { isTransactionAction } from 'modules/transaction/utils'

export function createTransactionMiddleware() {
  return store => next => action => {
    if (isTransactionAction(action)) {
      store.dispatch(fetchTransactionRequest(action))
    }

    return next(action)
  }
}
