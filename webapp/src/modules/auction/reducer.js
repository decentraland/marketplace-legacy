import { loadingReducer } from '@dapps/modules/loading/reducer'

import {
  FETCH_AUCTION_PARAMS_REQUEST,
  FETCH_AUCTION_PARAMS_SUCCESS,
  FETCH_AUCTION_PARAMS_FAILURE,
  FETCH_AUCTION_RATE_REQUEST,
  FETCH_AUCTION_RATE_SUCCESS,
  FETCH_AUCTION_RATE_FAILURE,
  SET_ON_CHAIN_PARCEL_OWNER,
  CHANGE_AUCTION_CENTER_PARCEL,
  SET_SELECTED_COORDINATES,
  FETCH_AUCTION_PRICE_REQUEST,
  FETCH_AUCTION_PRICE_FAILURE,
  FETCH_AUCTION_PRICE_SUCCESS,
  BID_ON_PARCELS_REQUEST,
  BID_ON_PARCELS_SUCCESS,
  BID_ON_PARCELS_FAILURE
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
    price: null,
    rate: {
      MANA: 1
    },
    params: {
      availableParcelCount: null,
      gasPriceLimit: null,
      landsLimitPerBid: null,
      totalManaBurned: null,
      totalLandsBidded: null,
      startTime: null,
      endTime: null
    },
    parcelOnChainOwners: {
      /* [parcelId]: owner */
    },
    selectedCoordinatesById: {
      /* [parcelId]: true */
    }
  },
  loading: [],
  error: null
}

export function auctionReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_AVAILABLE_PARCEL_REQUEST:
    case FETCH_AUCTION_RATE_REQUEST:
    case FETCH_AUCTION_PRICE_REQUEST:
    case FETCH_AUCTION_PARAMS_REQUEST:
    case BID_ON_PARCELS_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_AVAILABLE_PARCEL_SUCCESS:
    case CHANGE_AUCTION_CENTER_PARCEL: {
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
    case FETCH_AUCTION_PRICE_SUCCESS: {
      const { price } = action
      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          price
        }
      }
    }
    case FETCH_AUCTION_RATE_SUCCESS: {
      const { token, rate } = action
      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          rate: {
            ...state.data.rate,
            [token]: rate
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
          params: Object.keys(INITIAL_STATE.data.params).reduce(
            (acc, key) => ({
              ...acc,
              [key]: params[key] || 0
            }),
            {}
          )
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
    case BID_ON_PARCELS_SUCCESS: {
      return {
        ...state,
        error: null,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_AVAILABLE_PARCEL_FAILURE:
    case FETCH_AUCTION_PRICE_FAILURE:
    case FETCH_AUCTION_RATE_FAILURE:
    case FETCH_AUCTION_PARAMS_FAILURE:
    case BID_ON_PARCELS_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.error
      }
    }
    case SET_SELECTED_COORDINATES: {
      return {
        ...state,
        data: {
          ...state.data,
          selectedCoordinatesById: action.selectedCoordinatesById
        }
      }
    }
    default:
      return state
  }
}
