import {
  FETCH_PARCELS_REQUEST,
  FETCH_PARCELS_SUCCESS,
  FETCH_PARCELS_FAILURE,
  EDIT_PARCEL_REQUEST,
  EDIT_PARCEL_SUCCESS,
  EDIT_PARCEL_FAILURE,
  MERGE_PARCELS
} from './actions'
import { TRANSFER_PARCEL_SUCCESS } from 'modules/transfer/actions'
import { buildCoordinate } from 'lib/utils'
import { toParcelObject } from './utils'

const INITIAL_STATE = {
  data: {},
  loading_count: 0,
  error: null
}

export function parcelsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PARCELS_REQUEST: {
      return {
        ...state,
        loading_count: state.loading_count + 1
      }
    }
    case FETCH_PARCELS_SUCCESS: {
      return {
        ...state,
        error: null,
        loading_count: state.loading_count - 1,
        data: {
          ...state.data,
          ...toParcelObject(action.parcels)
        }
      }
    }
    case FETCH_PARCELS_FAILURE: {
      return {
        ...state,
        loading_count: state.loading_count - 1,
        error: action.error
      }
    }
    case MERGE_PARCELS: {
      return {
        ...state,
        data: {
          ...state.data,
          ...toParcelObject(action.parcels)
        }
      }
    }
    case EDIT_PARCEL_REQUEST: {
      const { parcel } = action
      return {
        ...state,
        data: {
          ...state.data,
          [parcel.id]: { ...parcel, isEditing: true }
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
            owner: newOwner.toLowerCase()
          }
        }
      }
    }
    default:
      return state
  }
}

export const getState = state => state.parcels
export const getParcels = state => getState(state).data
export const isLoading = state => getState(state).loading_count > 0
export const getError = state => getState(state).error
