import { createSelector } from 'reselect'
import { getPublications as getAllPublications } from 'modules/publication/selectors'

export const getState = state => state.dashboard
export const getData = state => getState(state).data
export const getLoading = state => getState(state).loading
export const isLoading = state => getLoading(state).length > 0
export const getError = state => getState(state).error

export const getStats = state => getData(state).stats
export const getGrid = state => getData(state).grid
export const getPublications = createSelector(
  getGrid,
  getAllPublications,
  (grid, publications) => grid.map(tx_hash => publications[tx_hash])
)
export const getTotal = state => getState(state).total
