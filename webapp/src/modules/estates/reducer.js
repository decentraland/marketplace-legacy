import {
  CREATE_ESTATE_REQUEST,
  CREATE_ESTATE_SUCCESS,
  CREATE_ESTATE_FAILURE,
  FETCH_ESTATE_REQUEST,
  FETCH_ESTATE_FAILURE,
  FETCH_ESTATE_SUCCESS,
  EDIT_ESTATE_METADATA_REQUEST,
  EDIT_ESTATE_METADATA_SUCCESS,
  EDIT_ESTATE_METADATA_FAILURE,
  EDIT_ESTATE_PARCELS_FAILURE,
  EDIT_ESTATE_PARCELS_REQUEST,
  EDIT_ESTATE_PARCELS_SUCCESS,
  DELETE_ESTATE_REQUEST,
  DELETE_ESTATE_FAILURE,
  DELETE_ESTATE_SUCCESS,
  TRANSFER_ESTATE_REQUEST,
  TRANSFER_ESTATE_SUCCESS,
  TRANSFER_ESTATE_FAILURE
} from './actions'
import { loadingReducer } from 'modules/loading/reducer'
import { FETCH_ADDRESS_ESTATES_SUCCESS } from 'modules/address/actions'
import { FETCH_MAP_SUCCESS } from 'modules/map/actions'
import { FETCH_TRANSACTION_SUCCESS } from 'modules/transaction/actions'
import { getEstateIdFromTxReceipt } from './utils'

const INITIAL_STATE = {
  data: {},
  loading: [],
  error: null
}

export function estatesReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ESTATE_REQUEST:
    case CREATE_ESTATE_REQUEST:
    case CREATE_ESTATE_SUCCESS:
    case EDIT_ESTATE_PARCELS_REQUEST:
    case EDIT_ESTATE_PARCELS_SUCCESS:
    case EDIT_ESTATE_METADATA_REQUEST:
    case EDIT_ESTATE_METADATA_SUCCESS:
    case DELETE_ESTATE_REQUEST:
    case DELETE_ESTATE_SUCCESS:
    case TRANSFER_ESTATE_REQUEST:
    case TRANSFER_ESTATE_SUCCESS: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_ESTATE_SUCCESS: {
      const { estate } = action
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [estate.id]: {
            ...estate
          }
        }
      }
    }
    case FETCH_ESTATE_FAILURE:
    case CREATE_ESTATE_FAILURE:
    case EDIT_ESTATE_PARCELS_FAILURE:
    case EDIT_ESTATE_METADATA_FAILURE:
    case DELETE_ESTATE_FAILURE:
    case TRANSFER_ESTATE_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.error
      }
    }
    case FETCH_MAP_SUCCESS: {
      return {
        ...state,
        data: action.assets.estates.reduce(
          (acc, estate) => {
            return { ...acc, [estate.id]: estate }
          },
          { ...state.data }
        )
      }
    }
    case FETCH_ADDRESS_ESTATES_SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.estates
        }
      }
    }
    case FETCH_TRANSACTION_SUCCESS: {
      const transaction = action.transaction

      switch (transaction.actionType) {
        case EDIT_ESTATE_METADATA_SUCCESS: {
          const { estate } = transaction.payload
          return {
            ...state,
            data: {
              ...state.data,
              [estate.id]: {
                ...state.data[estate.id],
                data: {
                  ...state.data[estate.id].data,
                  name: estate.data.name,
                  description: estate.data.description
                }
              }
            }
          }
        }
        case EDIT_ESTATE_PARCELS_SUCCESS: {
          const { estate } = transaction.payload
          const oldEstate = state.data[estate.id]
          return {
            ...state,
            data: {
              ...state.data,
              [estate.id]: {
                ...oldEstate,
                data: {
                  ...oldEstate.data,
                  parcels: estate.data.parcels
                }
              }
            }
          }
        }
        case TRANSFER_ESTATE_SUCCESS: {
          const { estate, to } = transaction.payload
          return {
            ...state,
            data: {
              ...state.data,
              [estate.id]: {
                ...state.data[estate.id],
                owner: to
              }
            }
          }
        }
        case DELETE_ESTATE_SUCCESS: {
          const { estate } = transaction.payload
          return {
            ...state,
            data: {
              ...state.data,
              [estate.id]: {
                ...state.data[estate.id],
                data: {
                  ...state.data[estate.id].data,
                  parcels: []
                }
              }
            }
          }
        }
        case CREATE_ESTATE_SUCCESS: {
          const { receipt } = transaction
          const { estate } = transaction.payload
          const estateId = getEstateIdFromTxReceipt(receipt)
          return {
            ...state,
            data: {
              ...state.data,
              [estateId]: {
                ...estate,
                id: estateId,
                token_id: estateId,
                owner: transaction.from
              }
            }
          }
        }
        default:
          return state
      }
    }
    default:
      return state
  }
}
