import { createSelector } from 'reselect'
import { getAddresses } from 'modules/address/selectors'

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
