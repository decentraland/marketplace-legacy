import {
  FETCH_PUBLICATIONS_REQUEST,
  FETCH_PUBLICATIONS_SUCCESS,
  FETCH_PUBLICATIONS_FAILURE,
  FETCH_PARCEL_PUBLICATIONS_REQUEST,
  FETCH_PARCEL_PUBLICATIONS_SUCCESS,
  FETCH_PARCEL_PUBLICATIONS_FAILURE,
  FETCH_DASHBOARD_PUBLICATIONS_REQUEST,
  FETCH_DASHBOARD_PUBLICATIONS_SUCCESS,
  FETCH_DASHBOARD_PUBLICATIONS_FAILURE,
  PUBLISH_REQUEST,
  PUBLISH_SUCCESS,
  PUBLISH_FAILURE,
  BUY_REQUEST,
  BUY_SUCCESS,
  BUY_FAILURE,
  CANCEL_SALE_REQUEST,
  CANCEL_SALE_SUCCESS,
  CANCEL_SALE_FAILURE
} from './actions'
import {
  FETCH_PARCEL_SUCCESS,
  FETCH_PARCELS_SUCCESS
} from 'modules/parcels/actions'
import { getParcelPublications } from 'modules/parcels/utils'
import { FETCH_ADDRESS_PARCELS_SUCCESS } from 'modules/address/actions'
import { FETCH_TRANSACTION_SUCCESS } from 'modules/transaction/actions'
import { loadingReducer } from 'modules/loading/reducer'
import { toPublicationsObject, PUBLICATION_STATUS } from './utils'

const INITIAL_STATE = {
  data: {},
  loading: [],
  error: null
}

export function publicationReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PARCEL_PUBLICATIONS_REQUEST:
    case FETCH_DASHBOARD_PUBLICATIONS_REQUEST:
    case FETCH_PUBLICATIONS_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_PARCEL_PUBLICATIONS_SUCCESS:
    case FETCH_DASHBOARD_PUBLICATIONS_SUCCESS:
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
    case FETCH_PARCEL_PUBLICATIONS_FAILURE:
    case FETCH_DASHBOARD_PUBLICATIONS_FAILURE:
    case FETCH_PUBLICATIONS_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.error
      }
    }
    case FETCH_PARCEL_SUCCESS: {
      const publication = action.parcel.publication
      if (publication) {
        return {
          ...state,
          data: {
            ...state.data,
            [publication.tx_hash]: {
              ...publication
            }
          }
        }
      }
      return state
    }
    case FETCH_PARCELS_SUCCESS:
    case FETCH_ADDRESS_PARCELS_SUCCESS: {
      const publications = getParcelPublications(action.parcels)

      if (publications.length > 0) {
        return {
          ...state,
          data: {
            ...state.data,
            ...toPublicationsObject(publications)
          }
        }
      }
      return state
    }
    case BUY_REQUEST:
    case BUY_FAILURE:
    case CANCEL_SALE_REQUEST:
    case CANCEL_SALE_FAILURE:
    case PUBLISH_REQUEST:
    case PUBLISH_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case PUBLISH_SUCCESS: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [action.publication.tx_hash]: {
            ...action.publication
          }
        }
      }
    }
    case BUY_SUCCESS:
    case CANCEL_SALE_SUCCESS: {
      const newState = {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data
        }
      }
      delete newState[action.publication.tx_hash]
      return newState
    }
    case FETCH_TRANSACTION_SUCCESS: {
      const transaction = action.transaction

      switch (transaction.actionType) {
        case BUY_SUCCESS: {
          const tx_hash = transaction.payload.tx_hash

          return {
            ...state,
            data: {
              ...state.data,
              [tx_hash]: {
                ...state.data[tx_hash],
                status: PUBLICATION_STATUS.sold
              }
            }
          }
        }
        case CANCEL_SALE_SUCCESS: {
          const tx_hash = transaction.payload.tx_hash

          return {
            ...state,
            data: {
              ...state.data,
              [tx_hash]: {
                ...state.data[tx_hash],
                status: PUBLICATION_STATUS.cancelled
              }
            }
          }
        }
        case PUBLISH_SUCCESS: {
          const tx_hash = transaction.payload.tx_hash

          return {
            ...state,
            data: {
              ...state.data,
              [tx_hash]: {
                ...state.data[tx_hash],
                status: PUBLICATION_STATUS.open
              }
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
