import { createSelector } from 'reselect'
import { getData as getAllParcels } from 'modules/parcels/selectors'
import { getPublications } from 'modules/publication/selectors'

export const getState = state => state.ui.marketplace
export const getGrid = state => getState(state).grid
export const getParcels = createSelector(
  getGrid,
  getPublications,
  getAllParcels,
  (grid, publications, parcels) =>
    grid.map(id => {
      return {
        ...parcels[id],
        publication:
          parcels[id].publication_tx_hash in publications
            ? publications[parcels[id].publication_tx_hash]
            : null
      }
    })
)
export const getTotal = state => getState(state).total
