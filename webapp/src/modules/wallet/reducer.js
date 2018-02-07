import {
  CONNECT_WALLET_REQUEST,
  CONNECT_WALLET_SUCCESS,
  CONNECT_WALLET_FAILURE,
  FETCH_WALLET_REQUEST,
  FETCH_WALLET_SUCCESS,
  FETCH_WALLET_FAILURE
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
    case CONNECT_WALLET_REQUEST:
    case FETCH_WALLET_REQUEST:
      return {
        ...state,
        loading: true
      }
    case CONNECT_WALLET_SUCCESS:
    case FETCH_WALLET_SUCCESS:
      return {
        loading: false,
        data: {
          ...state.data,
          ...action.wallet
        }
      }
    case CONNECT_WALLET_FAILURE:
    case FETCH_WALLET_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    default:
      return state
  }
}
