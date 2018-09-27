import {
  CONNECT_WALLET_REQUEST,
  CONNECT_WALLET_SUCCESS,
  CONNECT_WALLET_FAILURE,
  APPROVE_MANA_SUCCESS,
  AUTHORIZE_LAND_SUCCESS,
  TRANSFER_MANA_SUCCESS,
  UPDATE_DERIVATION_PATH,
  UPDATE_BALANCE,
  UPDATE_ETH_BALANCE,
  BUY_MANA_REQUEST,
  BUY_MANA_SUCCESS,
  BUY_MANA_FAILURE,
  APPROVE_MORTGAGE_FOR_MANA_SUCCESS,
  APPROVE_MORTGAGE_FOR_RCN_SUCCESS
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
    network: null,
    address: null,
    balance: null,
    ethBalance: null,
    approvedBalance: null,
    isLandAuthorized: null,
    derivationPath: null,
    locale: null,
    isMortgageApprovedForMana: null,
    isMortgageApprovedForRCN: null
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
          const mana = parseFloat(transaction.payload.mana)
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
          const price = parseFloat(transaction.payload.price)
          return {
            ...state,
            data: {
              ...state.data,
              balance: state.data.balance - price,
              approvedBalance: state.data.approvedBalance - price
            }
          }
        }
        case APPROVE_MORTGAGE_FOR_MANA_SUCCESS:
          return {
            ...state,
            data: {
              ...state.data,
              isMortgageApprovedForMana: transaction.payload.mana > 0
            }
          }
        case APPROVE_MORTGAGE_FOR_RCN_SUCCESS:
          return {
            ...state,
            data: {
              ...state.data,
              isMortgageApprovedForRCN: transaction.payload.rcn > 0
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
