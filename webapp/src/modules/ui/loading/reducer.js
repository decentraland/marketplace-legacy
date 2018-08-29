import { FETCH_MAP_SUCCESS, FETCH_MAP_FAILURE } from 'modules/map/actions'
import { SET_LOADING } from './actions'

const INITIAL_STATE = false

export function loadingReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_LOADING:
      return action.value
    case FETCH_MAP_FAILURE:
    case FETCH_MAP_SUCCESS:
      return false
    default:
      return state
  }
}
