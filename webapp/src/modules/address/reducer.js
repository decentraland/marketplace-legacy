import { createSelector } from 'reselect'
import { getParcels } from 'modules/parcels/reducer'
import { getDistricts } from 'modules/districts/reducer'
import {
  FETCH_ADDRESS_PARCELS_REQUEST,
  FETCH_ADDRESS_PARCELS_SUCCESS,
  FETCH_ADDRESS_PARCELS_FAILURE,
  FETCH_ADDRESS_CONTRIBUTIONS_REQUEST,
  FETCH_ADDRESS_CONTRIBUTIONS_SUCCESS,
  FETCH_ADDRESS_CONTRIBUTIONS_FAILURE
} from './actions'
import { toAddressParcelIds } from './utils'

const INITIAL_STATE = {
  data: {},
  loading: true,
  error: null
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ADDRESS_CONTRIBUTIONS_REQUEST:
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
    case FETCH_ADDRESS_CONTRIBUTIONS_FAILURE:
    case FETCH_ADDRESS_PARCELS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case FETCH_ADDRESS_CONTRIBUTIONS_SUCCESS:
      return {
        loading: false,
        error: null,
        data: {
          ...state.data,
          [action.address]: {
            ...state.data[action.address],
            contributions: action.contributions
          }
        }
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
  getDistricts,
  (data, allParcels, districts) =>
    Object.keys(data).reduce((map, address) => {
      const parcels = []
      const parcelsById = {}
      const parcels_ids = data[address].parcel_ids || []
      parcels_ids.forEach(id => {
        if (allParcels[id]) {
          parcels.push(allParcels[id])
          parcelsById[id] = allParcels[id]
        }
      })

      const contributionsById = {}
      const contributions = []
      if (data[address].contributions) {
        data[address].contributions.forEach(contribution => {
          const newContribution = {
            ...contribution,
            district: districts[contribution.district_id]
          }
          contributions.push(newContribution)
          contributionsById[contribution.district_id] = newContribution
        })
      }

      return {
        ...map,
        [address]: {
          ...data[address],
          parcels,
          parcelsById,
          contributions,
          contributionsById
        }
      }
    }, {})
)
