import {
  FETCH_DISTRICTS_REQUEST,
  FETCH_DISTRICTS_SUCCESS,
  FETCH_DISTRICTS_FAILURE
} from './actions'
import { toDistrictObject } from './utils'

const INITIAL_STATE = {
  data: {},
  loading: true,
  error: null
}

export function districtsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_DISTRICTS_REQUEST:
      return { ...state, loading: true }
    case FETCH_DISTRICTS_SUCCESS:
      return {
        loading: false,
        error: null,
        data: toDistrictObject(action.districts)
      }
    case FETCH_DISTRICTS_FAILURE:
      return { ...state, loading: false, error: action.error }
    default:
      return state
  }
}
