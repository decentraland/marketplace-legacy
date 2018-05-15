import {
  FETCH_MORTGAGED_PARCELS_REQUEST,
  FETCH_MORTGAGED_PARCELS_SUCCESS
} from './actions'

const INITIAL_STATE = {
  data: {
    parcels: []
  },
  loading: [],
  error: null
}

export function mortgageReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_MORTGAGED_PARCELS_REQUEST: {
      return {
        ...state,
        loading: true
      }
    }
    case FETCH_MORTGAGED_PARCELS_SUCCESS: {
      return {
        ...state,
        data: Object.assign({}, state.data, { parcels: action.payload }),
        loading: false
      }
    }
    default:
      return state
  }
}
