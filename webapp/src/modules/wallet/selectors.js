import { createSelector } from 'reselect'
import {
  APPROVE_MANA_SUCCESS,
  AUTHORIZE_LAND_SUCCESS,
  CONNECT_WALLET_REQUEST
} from './actions'
import { getAddresses } from 'modules/address/selectors'
import { getTransactionsByType } from 'modules/transaction/selectors'
import { isLoadingType } from 'modules/loading/selectors'

export const getState = state => state.wallet
export const getData = state => getState(state).data
export const getLoading = state => getState(state).loading
export const getError = state => getState(state).error
export const getNetwork = state => getData(state).network
export const getAddress = state => getData(state).address
export const getLocale = state => getData(state).locale
export const isConnected = state => !!getData(state).address
export const isConnecting = state =>
  isLoadingType(getLoading(state), CONNECT_WALLET_REQUEST)

export const getWallet = createSelector(
  getData,
  getAddresses,
  state =>
    getTransactionsByType(state, getAddress(state), APPROVE_MANA_SUCCESS),
  state =>
    getTransactionsByType(state, getAddress(state), AUTHORIZE_LAND_SUCCESS),
  (wallet, addresses, approveManaTransactions, authorizeLandTransactions) => {
    const address = addresses[wallet.address] || {}
    const {
      parcels = [],
      parcelsById = {},
      contributions = [],
      contributionsById = {}
    } = address

    return {
      ...wallet,
      parcels,
      parcelsById,
      contributions,
      contributionsById,
      approveManaTransactions,
      authorizeLandTransactions
    }
  }
)
