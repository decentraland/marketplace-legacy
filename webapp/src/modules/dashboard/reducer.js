import {
  FETCH_DASHBOARD_STATS_REQUEST,
  FETCH_DASHBOARD_STATS_SUCCESS,
  FETCH_DASHBOARD_STATS_FAILURE
} from './actions'
import { loadingReducer } from 'modules/loading/reducer'

const INITIAL_STATE = {
  data: {
    stats: null
  },
  loading: [],
  error: null
}

export function dashboardReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_DASHBOARD_STATS_REQUEST:
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    case FETCH_DASHBOARD_STATS_SUCCESS:
      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          stats: action.stats
        }
      }
    case FETCH_DASHBOARD_STATS_FAILURE:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.error
      }
    default:
      return state
  }
}
