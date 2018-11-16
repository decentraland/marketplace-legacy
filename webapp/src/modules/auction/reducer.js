import { loadingReducer } from '@dapps/modules/loading/reducer'
import {
  FETCH_AUCTION_PARAMS_REQUEST,
  FETCH_AUCTION_PARAMS_SUCCESS,
  FETCH_AUCTION_PARAMS_FAILURE,
  SET_ON_CHAIN_PARCEL_OWNER
} from './actions'
import {
  FETCH_AVAILABLE_PARCEL_REQUEST,
  FETCH_AVAILABLE_PARCEL_SUCCESS,
  FETCH_AVAILABLE_PARCEL_FAILURE
} from 'modules/parcels/actions'

const INITIAL_STATE = {
  data: {
    center: {
      x: null,
      y: null
    },
    params: {
      availableParcelCount: null,
      gasPriceLimit: null,
      landsLimitPerBid: null,
      currentPrice: null
    },
    parcelOnChainOwners: {
      /* [parcelId]: owner */
    }
  },
  loading: [],
  error: null
}

export function auctionReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_AVAILABLE_PARCEL_REQUEST:
    case FETCH_AUCTION_PARAMS_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_AVAILABLE_PARCEL_SUCCESS: {
      const { parcel } = action

      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          center: {
            x: parcel.x,
            y: parcel.y
          }
        }
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
            availableParcelCount: params.availableParcelCount,
            gasPriceLimit: params.gasPriceLimit,
            landsLimitPerBid: params.landsLimitPerBid,
            currentPrice: params.currentPrice
          }
        }
      }
    }
    case SET_ON_CHAIN_PARCEL_OWNER: {
      const { parcelId, owner } = action

      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          parcelOnChainOwners: {
            ...state.data.parcelOnChainOwners,
            [parcelId]: owner
          }
        }
      }
    }
    case FETCH_AVAILABLE_PARCEL_FAILURE:
    case FETCH_AUCTION_PARAMS_FAILURE: {
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
