import { FETCH_PUBLICATIONS_SUCCESS } from 'modules/publication/actions'
import { ASSET_TYPES } from 'shared/asset'
import { isParcel } from 'shared/parcel'

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
      return {
        ...state,
        grid: assets.map(asset => {
          let type = assetType
          if (!type) {
            type = isParcel(asset) ? ASSET_TYPES.parcel : ASSET_TYPES.estate
          }
          return { id: asset.id, type }
        }),
        totals: newTotals
      }
    }
    default:
      return state
  }
}
