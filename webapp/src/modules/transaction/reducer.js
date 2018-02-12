import { txUtils } from 'decentraland-commons'
import {
  FETCH_TRANSACTION_REQUEST,
  FETCH_TRANSACTION_SUCCESS,
  FETCH_TRANSACTION_FAILURE
} from './actions'
import { getTransactionFromAction, omitTransactionFromAction } from './utils'

const { TRANSACTION_STATUS } = txUtils

const INITIAL_STATE = {
  data: [],
  loading: false,
  error: null
}

export function transactionReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_TRANSACTION_REQUEST: {
      const transaction = getTransactionFromAction(action.actionRef)
      const actionRef = omitTransactionFromAction(action.actionRef) // Slimmer state
      return {
        ...state,
        data: [
          ...state.data,
          {
            ...transaction,
            timestamp: Date.now(),
            action: actionRef,
            status: TRANSACTION_STATUS.pending
          }
        ],
        loading: true
      }
    }
    case FETCH_TRANSACTION_SUCCESS: {
      return {
        ...state,
        error: null,
        loading: false,
        data: state.data.map(
          transaction =>
            action.transaction.hash === transaction.hash
              ? {
                  ...transaction,
                  ...action.transaction,
                  status: TRANSACTION_STATUS.confirmed
                }
              : transaction
        )
      }
    }
    case FETCH_TRANSACTION_FAILURE: {
      return {
        ...state,
        data: state.data.map(
          transaction =>
            action.transaction.hash === transaction.hash
              ? {
                  ...transaction,
                  ...action.transaction,
                  status: TRANSACTION_STATUS.failed,
                  error: action.error
                }
              : transaction
        ),
        loading: false,
        error: action.error
      }
    }
    default:
      return state
  }
}
