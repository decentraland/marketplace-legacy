import { createSelector } from 'reselect'
import { getWallet } from 'modules/wallet/reducer'
import { isLoading } from 'modules/address/reducer'
import { OPEN_SIDEBAR, CLOSE_SIDEBAR } from './actions'
import { land } from 'lib/land'

const INITIAL_STATE = {
  open: false
}

export function sidebarReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case OPEN_SIDEBAR:
      return {
        open: true
      }
    case CLOSE_SIDEBAR:
      return INITIAL_STATE
    default:
      return state
  }
}

export const getState = state => state.ui.sidebar
export const isOpen = state => getState(state).open
export const getStats = createSelector(
  getWallet,
  isLoading,
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
