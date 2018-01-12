import { createSelector } from 'reselect'
import { getParcels } from 'modules/parcels/reducer'
import {
  FETCH_ADDRESS_PARCELS_REQUEST,
  FETCH_ADDRESS_PARCELS_SUCCESS,
  FETCH_ADDRESS_PARCELS_FAILURE
} from './actions'
import { toAddressParcelIds } from './utils'

const INITIAL_STATE = {
  data: {},
  loading: true,
  error: null
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ADDRESS_PARCELS_REQUEST:
      return {
        ...state,
        loading: true
      }
    case FETCH_ADDRESS_PARCELS_SUCCESS:
      return {
        loading: false,
        error: null,
        data: {
          ...state.data,
          [action.address]: {
            ...state.data[action.address],
            parcel_ids: toAddressParcelIds(action.parcels)
          }
        }
      }
    case FETCH_ADDRESS_PARCELS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    default:
      return state
  }
}

export const getState = state => state.address
export const getData = state => getState(state).data
export const isLoading = state => getState(state).loading
export const getError = state => getState(state).error
export const getAddresses = createSelector(
  getData,
  getParcels,
  (data, allParcels) =>
    Object.keys(data).reduce((map, address) => {
      const parcels = []
      data[address].parcel_ids.forEach(id => {
        if (allParcels[id]) parcels.push(allParcels[id])
      })

      return {
        ...map,
        [address]: {
          ...data[address],
          parcels
        }
      }
    }, {})
)
