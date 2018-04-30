import { createSelector } from 'reselect'
import { getParcels as getAllParcels } from 'modules/parcels/selectors'

export const getState = state => state.ui.marketplace
export const getGrid = state => getState(state).grid
export const getParcels = createSelector(
  getGrid,
  getAllParcels,
  (grid, parcels) => grid.map(id => parcels[id])
)
export const getTotal = state => getState(state).total
