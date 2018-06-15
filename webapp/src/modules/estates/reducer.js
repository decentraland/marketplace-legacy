import {
  CREATE_ESTATE_REQUEST,
  CREATE_ESTATE_SUCCESS,
  CREATE_ESTATE_FAILURE,
  FETCH_ESTATE_REQUEST,
  FETCH_ESTATE_FAILURE,
  FETCH_ESTATE_SUCCESS
} from './actions'
import { loadingReducer } from 'modules/loading/reducer'
import { FETCH_ADDRESS_ESTATES_SUCCESS } from 'modules/address/actions'
import { FETCH_MAP_SUCCESS } from 'modules/map/actions'

const INITIAL_STATE = {
  data: {},
  loading: [],
  error: null
}

export function estatesReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ESTATE_REQUEST:
    case CREATE_ESTATE_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case CREATE_ESTATE_SUCCESS: {
      const { estate } = action
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [estate.id]: {
            ...estate
          }
        }
      }
    }
    case FETCH_ESTATE_FAILURE:
    case CREATE_ESTATE_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.error
      }
    }
    case FETCH_ESTATE_SUCCESS: {
      const { id, estate } = action
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [id]: estate
        }
      }
    }
    case FETCH_MAP_SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.assets.estates
        }
      }
    }
    case FETCH_ADDRESS_ESTATES_SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.estates
        }
      }
    }

    default:
      return state
  }
}
