import {
  FETCH_DASHBOARD_STATS_REQUEST,
  FETCH_DASHBOARD_STATS_SUCCESS,
  FETCH_DASHBOARD_STATS_FAILURE
} from './actions'
import { FETCH_DASHBOARD_PUBLICATIONS_SUCCESS } from 'modules/publication/actions'
import { loadingReducer } from 'modules/loading/reducer'

const INITIAL_STATE = {
  data: {
    stats: null,
    grid: [],
    total: 0
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
    case FETCH_DASHBOARD_PUBLICATIONS_SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          grid: action.publications.map(publication => publication.tx_hash),
          total: action.total
        }
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
