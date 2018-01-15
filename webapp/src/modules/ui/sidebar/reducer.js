import { createSelector } from 'reselect'
import { getWallet } from 'modules/wallet/reducer'
import { OPEN_SIDEBAR, CLOSE_SIDEBAR } from './actions'
import land from 'lib/land'

const INITIAL_STATE = {
  open: false
}

export default function reducer(state = INITIAL_STATE, action) {
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
export const getStats = createSelector(getWallet, wallet => {
  return {
    balance: wallet.balance,
    parcels: wallet.parcels.length,
    contribDistricts: wallet.contributions.length,
    contribMana: wallet.contributions.reduce(
      (total, contribution) =>
        total + land.convert(contribution.land_count, 'mana'),
      0
    )
  }
})
