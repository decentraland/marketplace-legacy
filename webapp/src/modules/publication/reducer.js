import { FETCH_ADDRESS_PUBLICATIONS_SUCCESS } from 'modules/address/actions'
import {
  FETCH_PUBLICATIONS_REQUEST,
  FETCH_PUBLICATIONS_SUCCESS,
  FETCH_PUBLICATIONS_FAILURE,
  PUBLISH_SUCCESS
} from './actions'
import { FETCH_TRANSACTION_SUCCESS } from 'modules/transaction/actions'
import { loadingReducer } from 'modules/loading/reducer'
import { toPublicationsObject } from './utils'

const INITIAL_STATE = {
  data: {},
  loading: [],
  error: null
}

export function publicationReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PUBLICATIONS_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_ADDRESS_PUBLICATIONS_SUCCESS:
    case FETCH_PUBLICATIONS_SUCCESS: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          ...toPublicationsObject(action.publications)
        }
      }
    }
    case FETCH_PUBLICATIONS_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.error
      }
    }
    case FETCH_TRANSACTION_SUCCESS: {
      const actionRef = action.transaction.action

      switch (actionRef.type) {
        case PUBLISH_SUCCESS: {
          const tx_hash = actionRef.publication.tx_hash

          return {
            ...state.data,
            [tx_hash]: {
              ...state.data[tx_hash],
              ...actionRef.publication
            }
          }
        }
        default:
          return state
      }
    }
    default:
      return state
  }
}
