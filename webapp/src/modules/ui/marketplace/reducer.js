import { FETCH_PUBLICATIONS_SUCCESS } from 'modules/publication/actions'

export const INITIAL_STATE = {
  grid: [],
  total: 0
}

export function marketplaceReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PUBLICATIONS_SUCCESS: {
      return {
        ...state,
        grid: action.parcels.map(parcel => parcel.id),
        total: action.total
      }
    }
    default:
      return state
  }
}
