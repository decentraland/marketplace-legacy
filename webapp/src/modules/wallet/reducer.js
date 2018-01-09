import { FETCH_WALLET_SUCCESS, FETCH_WALLET_FAILURE } from './actions'

const INITIAL_STATE = {
  address: null
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_WALLET_SUCCESS:
      return { address: action.address }
    case FETCH_WALLET_FAILURE:
    default:
      return state
  }
}

export const getState = state => state.wallet
export const getAddress = state => getState(state).address
export const isConnected = state => !!getState(state).address
