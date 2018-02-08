import {
  CONNECT_WALLET_REQUEST,
  CONNECT_WALLET_SUCCESS,
  CONNECT_WALLET_FAILURE,
  APPROVE_MANA_SUCCESS
} from './actions'
import { FETCH_TRANSACTION_SUCCESS } from 'modules/transaction/actions'

const INITIAL_STATE = {
  data: {
    address: null,
    balance: null,
    approvedBalance: null,
    landIsAuthorized: null
  },
  loading: false,
  error: null
}

export function walletReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CONNECT_WALLET_REQUEST:
      return {
        ...state,
        loading: true
      }
    case CONNECT_WALLET_SUCCESS:
      return {
        loading: false,
        data: {
          ...state.data,
          ...action.wallet
        }
      }
    case CONNECT_WALLET_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case FETCH_TRANSACTION_SUCCESS: {
      const actionRef = action.transaction.action

      switch (actionRef.type) {
        case APPROVE_MANA_SUCCESS:
          return {
            loading: false,
            data: {
              ...state.data,
              approvedBalance: actionRef.mana
            }
          }
        default:
          return state
      }
    }
    default:
      return state
  }
}
