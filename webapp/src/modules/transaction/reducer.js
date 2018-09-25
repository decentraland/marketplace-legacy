import { txUtils } from 'decentraland-eth'
import {
  FETCH_TRANSACTION_REQUEST,
  FETCH_TRANSACTION_SUCCESS,
  FETCH_TRANSACTION_FAILURE,
  CLEAR_TRANSACTIONS
} from './actions'
import { loadingReducer } from '@dapps/modules/loading/reducer'
import { getTransactionFromAction } from './utils'

const { TRANSACTION_TYPES } = txUtils

const INITIAL_STATE = {
  data: [],
  loading: [],
  error: null
}

export function transactionReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_TRANSACTION_REQUEST: {
      const actionRef = action.action
      const transaction = getTransactionFromAction(actionRef)
      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: [
          ...state.data,
          {
            ...transaction,
            timestamp: Date.now(),
            from: action.address,
            actionType: actionRef.type,
            status: TRANSACTION_TYPES.pending
          }
        ]
      }
    }
    case FETCH_TRANSACTION_SUCCESS: {
      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: state.data.map(
          transaction =>
            action.transaction.hash === transaction.hash
              ? {
                  ...transaction,
                  ...action.transaction,
                  status: TRANSACTION_TYPES.confirmed
                }
              : transaction
        )
      }
    }
    case FETCH_TRANSACTION_FAILURE: {
      return {
        loading: loadingReducer(state.loading, action),
        error: action.error,
        data: state.data.map(
          transaction =>
            action.transaction.hash === transaction.hash
              ? {
                  ...transaction,
                  ...action.transaction,
                  status: TRANSACTION_TYPES.failed,
                  error: action.error
                }
              : transaction
        )
      }
    }
    case CLEAR_TRANSACTIONS: {
      return {
        ...state,
        data: state.data.filter(
          transaction =>
            transaction.from !== action.address ||
            transaction.status === TRANSACTION_TYPES.pending
        )
      }
    }
    default:
      return state
  }
}
