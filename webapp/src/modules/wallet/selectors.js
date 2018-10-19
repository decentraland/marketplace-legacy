import { createSelector } from 'reselect'
import { TRANSFER_MANA_REQUEST, BUY_MANA_REQUEST } from './actions'
import { getData, getLoading } from '@dapps/modules/wallet/selectors'
import { isLoadingType } from '@dapps/modules/loading/selectors'
import { getAddresses } from 'modules/address/selectors'

export * from '@dapps/modules/wallet/selectors'

export const getWallet = createSelector(
  state => getData(state),
  state => getAddresses(state),
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
