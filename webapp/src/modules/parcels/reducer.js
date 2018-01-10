import { createSelector } from 'reselect'
import { getDistricts } from 'modules/districts/reducer'
import {
  FETCH_PARCELS_REQUEST,
  FETCH_PARCELS_SUCCESS,
  FETCH_PARCELS_FAILURE,
  EDIT_PARCEL
} from './actions'

const INITIAL_STATE = {
  data: {},
  loading: false,
  error: null
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PARCELS_REQUEST: {
      return {
        ...state,
        loading: false
      }
    }
    case FETCH_PARCELS_SUCCESS: {
      return {
        ...state,
        error: null,
        loading: false,
        data: {
          ...state.data,
          ...action.parcels
        }
      }
    }
    case FETCH_PARCELS_FAILURE: {
      return {
        ...state,
        loading: false,
        error: action.error
      }
    }
    case EDIT_PARCEL: {
      const { parcel } = action
      return {
        ...state,
        data: {
          ...state.data,
          [parcel.id]: parcel
        }
      }
    }
    default:
      return INITIAL_STATE
  }
}

export const getState = state => state.parcels
export const getData = state => getState(state).data
export const isLoading = state => getState(state).loading
export const getError = state => getState(state).error
export const getParcels = createSelector(
  getData,
  getDistricts,
  (data, districts) =>
    Object.keys(data).reduce((map, parcel) => {
      const district = districts[parcel.district_id]
      return {
        ...parcel,
        district
      }
    })
)
