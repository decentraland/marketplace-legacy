import {
  FETCH_PARCELS_FAILURE,
  FETCH_PARCELS_SUCCESS
} from 'modules/parcels/actions'
import { SET_LOADING } from './actions'

const INITIAL_STATE = false

export function loadingReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_LOADING:
      return action.value
    case FETCH_PARCELS_FAILURE:
    case FETCH_PARCELS_SUCCESS:
      return false
    default:
      return state
  }
}

export const isLoading = state => state.ui.loading
