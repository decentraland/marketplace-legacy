import {
  FETCH_PUBLICATIONS_SUCCESS,
  FETCH_ALL_PUBLICATIONS_SUCCESS,
  FETCH_ALL_MARKETPLACE_PUBLICATIONS_SUCCESS
} from 'modules/publication/actions'
import { ASSET_TYPES } from 'shared/asset'
import { isParcel } from 'shared/parcel'

const initTotals = { all: 0 }
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
      return {
        ...state,
        grid: assets.map(asset => ({ type: assetType, id: asset.id })),
        totals: {
          ...state.totals,
          [assetType]: total
        }
      }
    }
    case FETCH_ALL_PUBLICATIONS_SUCCESS: {
      const { totals, assets } = action
      return {
        ...state,
        grid: assets.map(asset => ({
          type: isParcel(asset) ? ASSET_TYPES.parcel : ASSET_TYPES.estate,
          id: asset.id
        })),
        totals
      }
    }
    case FETCH_ALL_MARKETPLACE_PUBLICATIONS_SUCCESS: {
      const { total, assets } = action
      return {
        ...state,
        grid: assets.map(asset => ({
          type: isParcel(asset) ? ASSET_TYPES.parcel : ASSET_TYPES.estate,
          id: asset.id
        })),
        totals: {
          ...state.totals,
          all: total
        }
      }
    }
    default:
      return state
  }
}
