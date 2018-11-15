import { loadingReducer } from '@dapps/modules/loading/reducer'
import {
  FETCH_AUCTION_PARAMS_REQUEST,
  FETCH_AUCTION_PARAMS_SUCCESS,
  FETCH_AUCTION_PARAMS_FAILURE,
  SET_ON_CHAIN_PARCEL_OWNER
} from './actions'

const INITIAL_STATE = {
  data: {
    params: {
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
    case FETCH_AUCTION_PARAMS_REQUEST: {
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
