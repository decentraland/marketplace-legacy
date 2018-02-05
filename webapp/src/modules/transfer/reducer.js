import {
  TRANSFER_PARCEL_REQUEST,
  TRANSFER_PARCEL_SUCCESS,
  TRANSFER_PARCEL_FAILURE,
  CLEAN_TRANSFER
} from './actions'

const INITIAL_STATE = {
  data: {},
  loading: false,
  error: null
}

export function transferReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TRANSFER_PARCEL_REQUEST: {
      return {
        ...state,
        loading: true
      }
    }
    case TRANSFER_PARCEL_SUCCESS: {
      return {
        ...state,
        error: null,
        loading: false,
        data: action.transfer
      }
    }
    case TRANSFER_PARCEL_FAILURE: {
      return {
        ...state,
        loading: false,
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
