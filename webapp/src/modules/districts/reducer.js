import {
  FETCH_DISTRICTS_REQUEST,
  FETCH_DISTRICTS_SUCCESS,
  FETCH_DISTRICTS_FAILURE
} from './actions'
import { loadingReducer } from '@dapps/modules/loading/reducer'
import { toDistrictObject } from './utils'

const INITIAL_STATE = {
  data: {},
  loading: [],
  error: null
}

export function districtsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_DISTRICTS_REQUEST:
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    case FETCH_DISTRICTS_SUCCESS:
      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: toDistrictObject(action.districts)
      }
    case FETCH_DISTRICTS_FAILURE:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.error
      }
    default:
      return state
  }
}
