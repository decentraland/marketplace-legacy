import { createSelector } from 'reselect'
import { getData as getAllParcels } from 'modules/parcels/selectors'
import { getEstates as getAllEstates } from 'modules/estates/selectors'
import { getData as getPublications } from 'modules/publication/selectors'
import { ASSET_TYPES } from 'shared/asset'

export const getState = state => state.ui.marketplace
export const getGrid = state => getState(state).grid
export const getAssets = createSelector(
  state => getGrid(state),
  state => getPublications(state),
  state => getAllParcels(state),
  state => getAllEstates(state),
  (grid, publications, parcels, estates) =>
    grid.reduce((acc, { type, id }) => {
      let asset
      if (type === ASSET_TYPES.parcel && parcels[id]) {
        asset = parcels[id]
      } else if (type === ASSET_TYPES.estate && estates[id]) {
        asset = estates[id]
      }

      if (asset) {
        acc.push({
          ...asset,
          publication:
            asset.publication_tx_hash in publications
              ? publications[asset.publication_tx_hash]
              : null
        })
      }

      return acc
    }, [])
)

export const getTotals = state => getState(state).totals
