import { FETCH_TILES_SUCCESS, FETCH_TILES_FAILURE } from 'modules/tile/actions'
import { SET_LOADING } from './actions'

const INITIAL_STATE = false

export function loadingReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_LOADING:
      return action.value
    case FETCH_TILES_FAILURE:
    case FETCH_TILES_SUCCESS:
      return false
    default:
      return state
  }
}
