import { FETCH_PUBLICATIONS_SUCCESS } from 'modules/publication/actions'
import { ASSET_TYPES } from 'shared/asset'

const initTotals = {}
for (let type in ASSET_TYPES) {
  initTotals[type] = 0
}

export const INITIAL_STATE = {
  grid: [],
  totals: initTotals
}

export function marketplaceReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PUBLICATIONS_SUCCESS: {
      const { assetType, total, assets } = action
      let newTotals = state.totals
      if (assetType) {
        newTotals = {
          ...state.totals,
          [assetType]: total
        }
      }
      const newGrid = action.isGrid
        ? assets.map(asset => ({
            id: asset.id,
            type: asset.publication.asset_type
          }))
        : state.grid
      return {
        ...state,
        grid: newGrid,
        totals: newTotals
      }
    }
    default:
      return state
  }
}
