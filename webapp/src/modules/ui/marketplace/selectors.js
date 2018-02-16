import { createSelector } from 'reselect'
import { getPublications as getAllPublications } from 'modules/publication/selectors'

export const getState = state => state.ui.marketplace
export const getGrid = state => getState(state).grid
export const getPublications = createSelector(
  getGrid,
  getAllPublications,
  (grid, publications) => grid.map(tx_hash => publications[tx_hash])
)
export const getTotal = state => getState(state).total
