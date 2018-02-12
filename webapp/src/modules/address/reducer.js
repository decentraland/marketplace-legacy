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
import { buildCoordinate } from 'lib/utils'
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
    case FETCH_ADDRESS_CONTRIBUTIONS_REQUEST:
      return {
        ...state,
        loading: [
          ...state.loading,
          { id: action.address, type: 'contributions' }
        ]
      }
    case FETCH_ADDRESS_PARCELS_REQUEST:
      return {
        ...state,
        loading: [...state.loading, { id: action.address, type: 'parcels' }]
      }
    case FETCH_ADDRESS_PUBLICATIONS_REQUEST:
      return {
        ...state,
        loading: [
          ...state.loading,
          { id: action.address, type: 'publications' }
        ]
      }
    case FETCH_ADDRESS_CONTRIBUTIONS_SUCCESS:
      return {
        loading: state.loading.filter(
          item => item.id === action.address && item.type === 'contributions'
        ),
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
        loading: state.loading.filter(
          item => item.id === action.address && item.type === 'parcels'
        ),
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
        loading: state.loading.filter(
          item => item.id === action.address && item.type === 'publications'
        ),
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
      return {
        ...state,
        loading: state.loading.filter(
          item => item.id === action.address && item.type === 'contributions'
        ),
        error: action.error
      }
    case FETCH_ADDRESS_PUBLICATIONS_FAILURE:
      return {
        ...state,
        loading: state.loading.filter(
          item => item.id === action.address && item.type === 'publications'
        ),
        error: action.error
      }
    case FETCH_ADDRESS_PARCELS_FAILURE:
      return {
        ...state,
        loading: state.loading.filter(
          item => item.id === action.address && item.type === 'parcels'
        ),
        error: action.error
      }
    case TRANSFER_PARCEL_SUCCESS: {
      const { x, y, oldOwner, newOwner } = action.transfer
      const parcelId = buildCoordinate(x, y)
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
