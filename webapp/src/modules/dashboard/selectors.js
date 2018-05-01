import { createSelector } from 'reselect'
import { getParcels as getAllParcels } from 'modules/parcels/selectors'

export const getState = state => state.dashboard
export const getData = state => getState(state).data
export const getLoading = state => getState(state).loading
export const isLoading = state => getLoading(state).length > 0
export const getError = state => getState(state).error

export const getStats = state => getData(state).stats
export const getGrid = state => getData(state).grid
export const getParcels = createSelector(
  getGrid,
  getAllParcels,
  (grid, parcels) => grid.map(id => parcels[id])
)
export const getTotal = state => getState(state).total
