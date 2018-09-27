import { createSelector } from 'reselect'
import { getWallet } from 'modules/wallet/selectors'
import { isLoading } from 'modules/address/selectors'
import { land } from 'lib/land'

export const getState = state => state.ui.sidebar
export const isOpen = state => getState(state).open
export const getStats = createSelector(
  state => getWallet(state),
  state => isLoading(state),
  (wallet, loading) => {
    const balance = wallet.balance
    const loaded = balance !== null && !loading
    const parcels = loaded ? wallet.parcels.length : null
    const contribDistricts = loaded ? wallet.contributions.length : null
    const contribMana = loaded
      ? wallet.contributions.reduce(
          (total, contribution) =>
            total + land.convert(contribution.land_count, 'mana'),
          0
        )
      : null
    return {
      balance,
      parcels,
      contribDistricts,
      contribMana
    }
  }
)
