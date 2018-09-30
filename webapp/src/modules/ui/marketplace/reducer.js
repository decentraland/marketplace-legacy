import { FETCH_PUBLICATIONS_SUCCESS } from 'modules/publication/actions'
import { ASSET_TYPES } from 'shared/asset'

export const INITIAL_STATE = {
  grid: [],
  total: 0
}

export function marketplaceReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PUBLICATIONS_SUCCESS: {
      return {
        ...state,
        grid: action.parcels
          .map(parcel => ({ type: ASSET_TYPES.parcel, id: parcel.id }))
          .concat(
            action.estates.map(estate => ({
              type: ASSET_TYPES.estate,
              id: estate.id
            }))
          ),
        total: action.total
      }
    }
    default:
      return state
  }
}
