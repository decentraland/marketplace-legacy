import {
  TRANSFER_MANA_SUCCESS,
  UPDATE_BALANCE,
  UPDATE_ETH_BALANCE,
  BUY_MANA_REQUEST,
  BUY_MANA_SUCCESS,
  BUY_MANA_FAILURE
} from './actions'
import {
  walletReducer as baseWallerReducer,
  INITIAL_STATE as BASE_INITIAL_STATE
} from '@dapps/modules/wallet/reducer'
import { loadingReducer } from '@dapps/modules/loading/reducer'
import { FETCH_TRANSACTION_SUCCESS } from '@dapps/modules/transaction/actions'
import { BUY_SUCCESS } from 'modules/publication/actions'

const INITIAL_STATE = {
  ...BASE_INITIAL_STATE,
  data: {
    ...BASE_INITIAL_STATE.data,
    ethBalance: null
  }
}

export function walletReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case BUY_MANA_REQUEST:
    case BUY_MANA_FAILURE:
    case BUY_MANA_SUCCESS:
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
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
              mana: state.data.mana - mana
            }
          }
        }
        case BUY_SUCCESS: {
          const price = parseFloat(transaction.payload.price)
          return {
            ...state,
            data: {
              ...state.data,
              mana: state.data.mana - price
            }
          }
        }
        default:
          return state
      }
    }
    case UPDATE_BALANCE:
      return {
        ...state,
        data: {
          ...state.data,
          mana: action.mana
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
    default:
      return baseWallerReducer(state, action)
  }
}
