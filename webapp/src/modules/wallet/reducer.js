import { createSelector } from 'reselect'
import { getAddresses } from 'modules/address/reducer'
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

export const getState = state => state.wallet
export const getData = state => getState(state).data
export const isLoading = state => getState(state).loading
export const getError = state => getState(state).error
export const getAddress = state => getData(state).address
export const isConnected = state => !!getData(state).address
export const getWallet = createSelector(
  getData,
  getAddresses,
  (wallet, addresses) => {
    const address = addresses[wallet.address]
    const parcels = address ? address.parcels : []
    const parcelsById = address ? address.parcelsById : {}
    const contributions = address ? address.contributions : []
    const contributionsById = address ? address.contributionsById : {}

    return {
      ...wallet,
      parcels,
      parcelsById,
      contributions,
      contributionsById
    }
  }
)
