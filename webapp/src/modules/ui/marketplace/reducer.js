import { FETCH_PUBLICATIONS_SUCCESS } from '../../publication/actions'

export const INITIAL_STATE = {
  grid: []
}

export function marketplaceReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PUBLICATIONS_SUCCESS: {
      return {
        ...state,
        grid: action.publications.map(publication => publication.tx_hash)
      }
    }
    default:
      return state
  }
}
