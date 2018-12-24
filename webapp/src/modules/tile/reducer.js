import {
  FETCH_TILES_REQUEST,
  FETCH_TILES_SUCCESS,
  FETCH_TILES_FAILURE
} from 'modules/tile/actions'
import { loadingReducer } from 'modules/ui/loading/reducer'

const INITIAL_STATE = {
  data: {},
  loading: [],
  error: null
}

export function tileReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_TILES_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_TILES_SUCCESS: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: {
          ...state.data,
          ...action.tiles
        }
      }
    }
    case FETCH_TILES_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.error
      }
    }
    default:
      return state
  }
}
