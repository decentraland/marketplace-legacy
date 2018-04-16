import {
  CONNECT_WALLET_REQUEST,
  CONNECT_WALLET_SUCCESS,
  CONNECT_WALLET_FAILURE,
  APPROVE_MANA_SUCCESS,
  AUTHORIZE_LAND_SUCCESS,
  TRANSFER_MANA_SUCCESS,
  UPDATE_DERIVATION_PATH,
  BUY_MANA_SUCCESS
} from './actions'
import { FETCH_TRANSACTION_SUCCESS } from 'modules/transaction/actions'
import {
  CHANGE_LOCALE,
  FETCH_TRANSLATIONS_SUCCESS
} from 'modules/translation/actions'
import { BUY_SUCCESS } from 'modules/publication/actions'
import { loadingReducer } from 'modules/loading/reducer'

const INITIAL_STATE = {
  data: {
    network: null,
    address: null,
    balance: null,
    approvedBalance: null,
    isLandAuthorized: null,
    derivationPath: null,
    locale: null
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
            ...state,
            data: {
              ...state.data,
              approvedBalance: transaction.payload.mana
            }
          }
        case AUTHORIZE_LAND_SUCCESS:
          return {
            ...state,
            data: {
              ...state.data,
              isLandAuthorized: transaction.payload.isAuthorized
            }
          }
        case TRANSFER_MANA_SUCCESS: {
          const mana = parseFloat(transaction.payload.mana, 10)
          return {
            ...state,
            data: {
              ...state.data,
              balance: state.data.balance - mana,
              approvedBalance: state.data.approvedBalance - mana
            }
          }
        }
        case BUY_SUCCESS: {
          const price = parseFloat(transaction.payload.price, 10)
          return {
            ...state,
            data: {
              ...state.data,
              balance: state.data.balance - price,
              approvedBalance: state.data.approvedBalance - price
            }
          }
        }
        case BUY_MANA_SUCCESS: {
          const { mana } = transaction.payload
          return {
            ...state,
            data: {
              ...state.data,
              balance: state.data.balance + mana
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
    case CHANGE_LOCALE:
    case FETCH_TRANSLATIONS_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          locale: action.locale
        }
      }
    default:
      return state
  }
}
