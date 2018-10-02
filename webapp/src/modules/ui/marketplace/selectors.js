import { createSelector } from 'reselect'
import { getData as getAllParcels } from 'modules/parcels/selectors'
import { getEstates as getAllEstates } from 'modules/estates/selectors'
import { getPublications } from 'modules/publication/selectors'
import { ASSET_TYPES } from 'shared/asset'

export const getState = state => state.ui.marketplace
export const getGrid = state => getState(state).grid
export const getParcels = createSelector(
  state => getGrid(state),
  state => getPublications(state),
  state => getAllParcels(state),
  (grid, publications, parcels) =>
    grid.reduce((acc, { type, id }) => {
      if (type === ASSET_TYPES.parcel && parcels[id]) {
        acc.push({
          ...parcels[id],
          publication:
            parcels[id].publication_tx_hash in publications
              ? publications[parcels[id].publication_tx_hash]
              : null
        })
      }
      return acc
    }, [])
)

export const getEstates = createSelector(
  state => getGrid(state),
  state => getPublications(state),
  state => getAllEstates(state),
  (grid, publications, estates) =>
    grid.reduce((acc, { type, id }) => {
      if (type === ASSET_TYPES.estate && estates[id]) {
        acc.push({
          ...estates[id],
          publication:
            estates[id].publication_tx_hash in publications
              ? publications[estates[id].publication_tx_hash]
              : null
        })
      }
      return acc
    }, [])
)
export const getTotal = state => getState(state).total
