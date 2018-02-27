import {
  FETCH_ADDRESS_PARCELS_REQUEST,
  FETCH_ADDRESS_PARCELS_SUCCESS,
  FETCH_ADDRESS_PARCELS_FAILURE,
  FETCH_ADDRESS_CONTRIBUTIONS_REQUEST,
  FETCH_ADDRESS_CONTRIBUTIONS_SUCCESS,
  FETCH_ADDRESS_CONTRIBUTIONS_FAILURE,
  FETCH_ADDRESS_PUBLICATIONS_REQUEST,
  FETCH_ADDRESS_PUBLICATIONS_SUCCESS,
  FETCH_ADDRESS_PUBLICATIONS_FAILURE
} from './actions'
import { TRANSFER_PARCEL_SUCCESS } from 'modules/transfer/actions'
import { loadingReducer } from 'modules/loading/reducer'
import { toAddressParcelIds, toAddressPublicationIds } from './utils'

const EMPTY_ADDRESS = {
  contributions: [],
  parcel_ids: [],
  publication_ids: []
}

const INITIAL_STATE = {
  data: {},
  loading: [],
  error: null
}

export function addressReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ADDRESS_PARCELS_REQUEST:
    case FETCH_ADDRESS_CONTRIBUTIONS_REQUEST:
    case FETCH_ADDRESS_PUBLICATIONS_REQUEST:
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    case FETCH_ADDRESS_CONTRIBUTIONS_SUCCESS:
      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [action.address]: {
            ...state.data[action.address],
            contributions: action.contributions
          }
        }
      }
    case FETCH_ADDRESS_PARCELS_SUCCESS:
      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [action.address]: {
            ...state.data[action.address],
            parcel_ids: toAddressParcelIds(action.parcels)
          }
        }
      }
    case FETCH_ADDRESS_PUBLICATIONS_SUCCESS:
      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [action.address]: {
            ...state.data[action.address],
            publication_ids: toAddressPublicationIds(action.publications)
          }
        }
      }
    case FETCH_ADDRESS_CONTRIBUTIONS_FAILURE:
    case FETCH_ADDRESS_PUBLICATIONS_FAILURE:
    case FETCH_ADDRESS_PARCELS_FAILURE:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.error
      }
    case TRANSFER_PARCEL_SUCCESS: {
      const { oldOwner, newOwner, parcelId } = action.transfer
      const oldOwnerAddress = state.data[oldOwner] || { ...EMPTY_ADDRESS }
      const newOwnerAddress = state.data[newOwner] || { ...EMPTY_ADDRESS }
      return {
        ...state,
        data: {
          ...state.data,
          [oldOwner]: {
            ...oldOwnerAddress,
            parcel_ids: oldOwnerAddress.parcel_ids.filter(x => x !== parcelId)
          },
          [newOwner]: {
            ...newOwnerAddress,
            parcel_ids: newOwnerAddress.parcel_ids.concat(parcelId)
          }
        }
      }
    }
    default:
      return state
  }
}
