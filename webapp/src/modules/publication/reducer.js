import { FETCH_ADDRESS_PUBLICATIONS_SUCCESS } from 'modules/address/actions'
import {
  FETCH_PUBLICATIONS_REQUEST,
  FETCH_PUBLICATIONS_SUCCESS,
  FETCH_PUBLICATIONS_FAILURE
} from './actions'
import { toPublicationsObject } from './utils'

const INITIAL_STATE = {
  data: {},
  loading: false,
  error: null
}

export function publicationReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PUBLICATIONS_REQUEST: {
      return {
        ...state,
        loading: true
      }
    }
    case FETCH_ADDRESS_PUBLICATIONS_SUCCESS:
    case FETCH_PUBLICATIONS_SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          ...toPublicationsObject(action.publications)
        },
        loading: false,
        error: null
      }
    }
    case FETCH_PUBLICATIONS_FAILURE: {
      return {
        ...state,
        loading: false,
        error: action.error
      }
    }
    default:
      return state
  }
}
