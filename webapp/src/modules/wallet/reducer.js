import {
  CONNECT_WALLET_REQUEST,
  CONNECT_WALLET_SUCCESS,
  CONNECT_WALLET_FAILURE,
  TRANSFER_MANA_SUCCESS,
  UPDATE_DERIVATION_PATH,
  UPDATE_BALANCE,
  UPDATE_ETH_BALANCE,
  BUY_MANA_REQUEST,
  BUY_MANA_SUCCESS,
  BUY_MANA_FAILURE
} from './actions'
import { loadingReducer } from '@dapps/modules/loading/reducer'
import {
  CHANGE_LOCALE,
  FETCH_TRANSLATIONS_SUCCESS
} from '@dapps/modules/translation/actions'
import { FETCH_TRANSACTION_SUCCESS } from '@dapps/modules/transaction/actions'
import { BUY_SUCCESS } from 'modules/publication/actions'

const INITIAL_STATE = {
  data: {
    locale: null,
    network: null,
    address: null,
    balance: null,
    derivationPath: null,
    ethBalance: null,
    allowances: {},
    approvals: {}
  },
  loading: [],
  error: null
}

export function walletReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case BUY_MANA_REQUEST:
    case BUY_MANA_FAILURE:
    case BUY_MANA_SUCCESS:
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
      const { transaction } = action.payload

      switch (transaction.actionType) {
        case TRANSFER_MANA_SUCCESS: {
          const mana = parseFloat(transaction.payload.mana)
          return {
            ...state,
            data: {
              ...state.data,
              balance: state.data.balance - mana
            }
          }
        }
        case BUY_SUCCESS: {
          const price = parseFloat(transaction.payload.price)
          return {
            ...state,
            data: {
              ...state.data,
              balance: state.data.balance - price
            }
          }
        }
        default:
          return state
      }
    }
    case UPDATE_DERIVATION_PATH:
      return {
        ...state,
        data: {
          ...state.data,
          derivationPath: action.derivationPath
        }
      }
    case UPDATE_BALANCE:
      return {
        ...state,
        data: {
          ...state.data,
          balance: action.balance
        }
      }
    case UPDATE_ETH_BALANCE:
      return {
        ...state,
        data: {
          ...state.data,
          ethBalance: action.ethBalance
        }
      }
    case CHANGE_LOCALE:
    case FETCH_TRANSLATIONS_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          locale: action.payload.locale
        }
      }
    default:
      return state
  }
}
