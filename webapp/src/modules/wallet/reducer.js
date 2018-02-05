import {
  FETCH_WALLET_REQUEST,
  FETCH_WALLET_SUCCESS,
  FETCH_WALLET_FAILURE,
  FETCH_BALANCE_REQUEST,
  FETCH_BALANCE_SUCCESS,
  FETCH_BALANCE_FAILURE
} from './actions'

const INITIAL_STATE = {
  data: {
    balance: null,
    address: null
  },
  loading: false,
  error: null
}

export function walletReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_WALLET_REQUEST:
    case FETCH_BALANCE_REQUEST:
      return {
        ...state,
        loading: true
      }
    case FETCH_WALLET_SUCCESS:
    case FETCH_BALANCE_SUCCESS:
      return {
        loading: false,
        data: {
          ...state.data,
          ...action.wallet
        }
      }
    case FETCH_WALLET_FAILURE:
    case FETCH_BALANCE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    default:
      return state
  }
}
