import { createSelector } from 'reselect'
import {
  CONNECT_WALLET_REQUEST,
  TRANSFER_MANA_REQUEST,
  BUY_MANA_REQUEST
} from './actions'
import { isLoadingType } from '@dapps/modules/loading/selectors'
import { getTransactionsByType } from '@dapps/modules/transaction/selectors'
import { getAddresses } from 'modules/address/selectors'

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

// state =>
//   getTransactionsByType(state, getAddress(state), APPROVE_MANA_SUCCESS),
// state =>
//   getTransactionsByType(state, getAddress(state), AUTHORIZE_LAND_SUCCESS),
// state =>
//   getTransactionsByType(
//     state,
//     getAddress(state),
//     APPROVE_MORTGAGE_FOR_MANA_SUCCESS
//   ),
// state =>
//   getTransactionsByType(
//     state,
//     getAddress(state),
//     APPROVE_MORTGAGE_FOR_RCN_SUCCESS
//   )

export const getWallet = createSelector(
  state => getData(state),
  state => getAddresses(state),
  getData,
  getAddresses,
  (wallet, addresses) => {
    const address = addresses[wallet.address] || {}
    const {
      parcels = [],
      parcelsById = {},
      estates = [],
      estatesById = {},
      contributions = [],
      contributionsById = {}
    } = address

    return {
      ...wallet,
      parcels,
      parcelsById,
      estates,
      estatesById,
      contributions,
      contributionsById
    }
  }
)

export const isTransferManaTransactionIdle = state =>
  isLoadingType(getLoading(state), TRANSFER_MANA_REQUEST)

export const isBuyManaTransactionIdle = state =>
  isLoadingType(getLoading(state), BUY_MANA_REQUEST)
