import { createSelector } from 'reselect'
import { getDistricts } from 'modules/districts/reducer'
import {
  FETCH_PARCELS_REQUEST,
  FETCH_PARCELS_SUCCESS,
  FETCH_PARCELS_FAILURE
} from './actions'
import { toParcelObject } from './utils'

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
        loading: true
      }
    }
    case FETCH_PARCELS_SUCCESS: {
      return {
        ...state,
        error: null,
        loading: false,
        data: {
          ...state.data,
          ...toParcelObject(action.parcels)
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
    default:
      return state
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
    Object.keys(data).reduce((map, parcelId) => {
      const currentData = data[parcelId]
      const newData = {
        ...currentData,
        district: districts[currentData.district_id]
      }

      return {
        ...data,
        [parcelId]: newData
      }
    }, {})
)
