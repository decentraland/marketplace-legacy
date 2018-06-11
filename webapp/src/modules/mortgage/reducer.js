import { combineReducers } from 'redux'
import { loadingReducer } from 'modules/loading/reducer'

import {
  CREATE_MORTGAGE_REQUEST,
  CREATE_MORTGAGE_SUCCESS,
  CREATE_MORTGAGE_FAILURE,
  FETCH_MORTGAGED_PARCELS_REQUEST,
  FETCH_MORTGAGED_PARCELS_SUCCESS,
  FETCH_MORTGAGED_PARCELS_FAILURE,
  FETCH_ACTIVE_PARCEL_MORTGAGES_REQUEST,
  FETCH_ACTIVE_PARCEL_MORTGAGES_FAILURE,
  FETCH_ACTIVE_PARCEL_MORTGAGES_SUCCESS,
  CANCEL_MORTGAGE_FAILURE,
  PAY_MORTGAGE_REQUEST,
  PAY_MORTGAGE_FAILURE,
  PAY_MORTGAGE_SUCCESS,
  CLAIM_MORTGAGE_RESOLUTION_FAILURE,
  CANCEL_MORTGAGE_SUCCESS,
  CLAIM_MORTGAGE_RESOLUTION_SUCCESS
} from './actions'

const INITIAL_DATA_STATE = {
  mortgages: {}
}

export function data(state = INITIAL_DATA_STATE, action) {
  switch (action.type) {
    case FETCH_MORTGAGED_PARCELS_SUCCESS:
    case FETCH_ACTIVE_PARCEL_MORTGAGES_SUCCESS: {
      return {
        ...state,
        mortgages: action.mortgages.reduce(
          (normalizedMortgages, mortgage) => ({
            ...normalizedMortgages,
            [mortgage.tx_hash]: mortgage
          }),
          state.mortgages
        )
      }
    }
    default:
      return state
  }
}

export function loading(state = [], action) {
  switch (action.type) {
    case CREATE_MORTGAGE_REQUEST:
    case CREATE_MORTGAGE_SUCCESS:
    case CREATE_MORTGAGE_FAILURE:
    case FETCH_MORTGAGED_PARCELS_SUCCESS:
    case FETCH_ACTIVE_PARCEL_MORTGAGES_SUCCESS:
    case FETCH_ACTIVE_PARCEL_MORTGAGES_FAILURE:
    case FETCH_MORTGAGED_PARCELS_FAILURE:
    case FETCH_MORTGAGED_PARCELS_REQUEST:
    case PAY_MORTGAGE_REQUEST:
    case PAY_MORTGAGE_FAILURE:
    case PAY_MORTGAGE_SUCCESS:
    case FETCH_ACTIVE_PARCEL_MORTGAGES_REQUEST: {
      return loadingReducer(state, action)
    }
    default:
      return state
  }
}

export function error(state = '', action) {
  switch (action.type) {
    case FETCH_ACTIVE_PARCEL_MORTGAGES_FAILURE:
    case FETCH_MORTGAGED_PARCELS_FAILURE:
    case CREATE_MORTGAGE_FAILURE:
    case CANCEL_MORTGAGE_FAILURE:
    case PAY_MORTGAGE_FAILURE:
    case CLAIM_MORTGAGE_RESOLUTION_FAILURE:
      return action.error
    case FETCH_ACTIVE_PARCEL_MORTGAGES_SUCCESS:
    case FETCH_MORTGAGED_PARCELS_SUCCESS:
    case CREATE_MORTGAGE_SUCCESS:
    case CANCEL_MORTGAGE_SUCCESS:
    case PAY_MORTGAGE_SUCCESS:
    case CLAIM_MORTGAGE_RESOLUTION_SUCCESS:
      return ''
    default:
      return state
  }
}

export default combineReducers({
  data,
  loading,
  error
})
