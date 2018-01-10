import { createSelector } from 'reselect'
import { getDistricts } from 'modules/districts/reducer'
import { getSelected } from 'modules/ui/reducer'
import {
  FETCH_PARCELS_REQUEST,
  FETCH_PARCELS_SUCCESS,
  FETCH_PARCELS_FAILURE,
  EDIT_PARCEL
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
  getSelected,
  state => state.wallet.data,
  state => state.address.data,
  (data, districts, selected, wallet, addresses) => {
    const now = Date.now()
    const result = Object.keys(data).reduce((newData, parcelId) => {
      const parcel = data[parcelId]
      const district = parcel.district_id ? districts[parcel.district_id] : null
      const address = addresses[wallet.address]
      const owned = address
        ? address.parcel_ids.some(id => id === parcelId)
        : false

      const newParcel = {
        ...parcel,
        price: parseInt(parcel.price),
        district,
        owned,
        selected: selected
          ? selected.x === parcel.x && selected.y === parcel.y
          : false
      }

      return {
        ...newData,
        [parcelId]: newParcel
      }
    }, {})
    const elapsed = Date.now() - now
    console.log(elapsed)
    return result
  }
)
