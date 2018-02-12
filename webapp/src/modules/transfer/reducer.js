import {
  TRANSFER_PARCEL_REQUEST,
  TRANSFER_PARCEL_SUCCESS,
  TRANSFER_PARCEL_FAILURE,
  CLEAN_TRANSFER
} from './actions'
import { loadingReducer } from 'modules/loading/reducer'

const INITIAL_STATE = {
  data: {},
  loading: [],
  error: null
}

export function transferReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TRANSFER_PARCEL_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case TRANSFER_PARCEL_SUCCESS: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: action.transfer
      }
    }
    case TRANSFER_PARCEL_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.error
      }
    }
    case CLEAN_TRANSFER: {
      return INITIAL_STATE
    }
    default:
      return state
  }
}
