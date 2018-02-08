import { createSelector } from 'reselect'
import { APPROVE_MANA_SUCCESS, AUTHORIZE_LAND_SUCCESS } from './actions'
import { getAddresses } from 'modules/address/selectors'
import { getTransactionsByType } from 'modules/transaction/selectors'

export const getState = state => state.wallet
export const getData = state => getState(state).data
export const isLoading = state => getState(state).loading
export const getError = state => getState(state).error
export const getAddress = state => getData(state).address
export const isConnected = state => !!getData(state).address
export const getWallet = createSelector(
  getData,
  getAddresses,
  state => getTransactionsByType(state, APPROVE_MANA_SUCCESS),
  state => getTransactionsByType(state, AUTHORIZE_LAND_SUCCESS),
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
