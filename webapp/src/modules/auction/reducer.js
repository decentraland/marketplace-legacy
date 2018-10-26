import {
  FETCH_AUCTION_PARAMS_REQUEST,
  FETCH_AUCTION_PARAMS_SUCCESS,
  FETCH_AUCTION_PARAMS_FAILURE
} from './actions'
import {
  FETCH_PARCEL_OWNER_REQUEST,
  FETCH_PARCEL_OWNER_SUCCESS,
  FETCH_PARCEL_OWNER_FAILURE
} from 'modules/parcels/actions'
import { loadingReducer } from '@dapps/modules/loading/reducer'

const INITIAL_STATE = {
  data: {
    params: {
      gasPriceLimit: null,
      landsLimitPerBid: null,
      currentPrice: null
    },
    parcelOwners: {
      /* [parcelId]: owner */
    }
  },
  loading: [],
  error: null
}

export function auctionReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_AUCTION_PARAMS_REQUEST:
    case FETCH_PARCEL_OWNER_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_AUCTION_PARAMS_SUCCESS: {
      const { params } = action

      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          params: {
            gasPriceLimit: params.gasPriceLimit,
            landsLimitPerBid: params.landsLimitPerBid,
            currentPrice: params.currentPrice
          }
        }
      }
    }
    case FETCH_PARCEL_OWNER_SUCCESS: {
      const { parcel, owner } = action

      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [parcel.id]: owner
        }
      }
    }
    case FETCH_AUCTION_PARAMS_FAILURE:
    case FETCH_PARCEL_OWNER_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.payload.error
      }
    }
    default:
      return state
  }
}
