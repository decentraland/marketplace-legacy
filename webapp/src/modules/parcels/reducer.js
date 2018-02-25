import {
  FETCH_PARCELS_REQUEST,
  FETCH_PARCELS_SUCCESS,
  FETCH_PARCELS_FAILURE,
  FETCH_PARCEL_REQUEST,
  FETCH_PARCEL_SUCCESS,
  FETCH_PARCEL_FAILURE,
  FETCH_PARCEL_DATA_REQUEST,
  FETCH_PARCEL_DATA_SUCCESS,
  FETCH_PARCEL_DATA_FAILURE,
  EDIT_PARCEL_REQUEST,
  EDIT_PARCEL_SUCCESS,
  EDIT_PARCEL_FAILURE
} from './actions'
import { FETCH_ADDRESS_PARCELS_SUCCESS } from 'modules/address/actions'
import { TRANSFER_PARCEL_SUCCESS } from 'modules/transfer/actions'
import { buildCoordinate } from 'lib/utils'
import { toParcelObject } from './utils'
import { loadingReducer } from 'modules/loading/reducer'

const INITIAL_STATE = {
  data: {},
  loading: [],
  error: null
}

export function parcelsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PARCEL_REQUEST:
    case FETCH_PARCEL_DATA_REQUEST:
    case FETCH_PARCELS_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_PARCEL_SUCCESS:
    case FETCH_PARCEL_DATA_SUCCESS: {
      const parcelId = action.parcel.id
      const oldParcel = state[action.parcel.id]
      const newParcel = action.parcel
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [parcelId]: {
            ...oldParcel,
            ...newParcel
          }
        }
      }
    }
    case FETCH_PARCELS_SUCCESS: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          ...toParcelObject(action.parcels, state.data)
        }
      }
    }
    case FETCH_PARCEL_FAILURE:
    case FETCH_PARCEL_DATA_FAILURE:
    case FETCH_PARCELS_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.error
      }
    }
    case FETCH_ADDRESS_PARCELS_SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          ...toParcelObject(action.parcels, state.data)
        }
      }
    }
    case EDIT_PARCEL_REQUEST: {
      const parcelId = action.parcel.id
      const parcel = state.data[parcelId]
      return {
        ...state,
        data: {
          ...state.data,
          [parcelId]: { ...parcel, isEditing: true }
        }
      }
    }
    case EDIT_PARCEL_SUCCESS:
    case EDIT_PARCEL_FAILURE: {
      const { parcel } = action
      return {
        ...state,
        data: {
          ...state.data,
          [parcel.id]: { ...parcel, isEditing: false }
        }
      }
    }
    case TRANSFER_PARCEL_SUCCESS: {
      const { x, y, newOwner } = action.transfer
      const parcelId = buildCoordinate(x, y)
      const parcel = state.data[parcelId]
      return {
        ...state,
        data: {
          ...state.data,
          [parcel.id]: {
            ...parcel,
            owner: newOwner
          }
        }
      }
    }
    default:
      return state
  }
}
