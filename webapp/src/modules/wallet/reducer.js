import {
  CONNECT_WALLET_REQUEST,
  CONNECT_WALLET_SUCCESS,
  CONNECT_WALLET_FAILURE,
  APPROVE_MANA_SUCCESS,
  AUTHORIZE_LAND_SUCCESS
} from './actions'
import { FETCH_TRANSACTION_SUCCESS } from 'modules/transaction/actions'
import { loadingReducer } from 'modules/loading/reducer'

const INITIAL_STATE = {
  data: {
    address: null,
    balance: null,
    approvedBalance: null,
    landIsAuthorized: null
  },
  loading: [],
  error: null
}

export function walletReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CONNECT_WALLET_REQUEST:
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    case CONNECT_WALLET_SUCCESS:
      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          ...action.wallet
        }
      }
    case CONNECT_WALLET_FAILURE:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
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
        case AUTHORIZE_LAND_SUCCESS:
          return {
            loading: false,
            data: {
              ...state.data,
              isLandAuthorized: actionRef.isAuthorized
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
