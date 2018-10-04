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
      const { assetType, totals, assets } = action
      return {
        ...state,
        grid: assets.map(asset => ({ type: assetType, id: asset.id })),
        totals: {
          // ...state.totals,
          // [assetType]: totals[assetType]
          ...totals //@nacho TODO: ask to the team
        }
      }
    }
    default:
      return state
  }
}
