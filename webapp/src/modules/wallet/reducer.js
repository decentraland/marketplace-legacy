import {
  CONNECT_WALLET_REQUEST,
  CONNECT_WALLET_SUCCESS,
  CONNECT_WALLET_FAILURE,
  APPROVE_MANA_SUCCESS,
  AUTHORIZE_LAND_SUCCESS,
  UPDATE_DERIVATION_PATH
} from './actions'
import { FETCH_TRANSACTION_SUCCESS } from 'modules/transaction/actions'
import { loadingReducer } from 'modules/loading/reducer'

const INITIAL_STATE = {
  data: {
    address: null,
    balance: null,
    approvedBalance: null,
    isLandAuthorized: null,
    derivationPath: null
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
      const transaction = action.transaction

      switch (transaction.actionType) {
        case APPROVE_MANA_SUCCESS:
          return {
            loading: false,
            data: {
              ...state.data,
              approvedBalance: transaction.payload.mana
            }
          }
        case AUTHORIZE_LAND_SUCCESS:
          return {
            loading: false,
            data: {
              ...state.data,
              isLandAuthorized: transaction.payload.isAuthorized
            }
          }
        default:
          return state
      }
    }
    case UPDATE_DERIVATION_PATH:
      return {
        data: {
          ...state.data,
          derivationPath: action.derivationPath
        }
      }
    default:
      return state
  }
}
