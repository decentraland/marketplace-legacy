import { FETCH_MAP_REQUEST, FETCH_MAP_FAILURE } from 'modules/map/actions'
import { loadingReducer } from 'modules/ui/loading/reducer'

const INITIAL_STATE = {
  data: {},
  loading: [],
  error: null
}

export function mapReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_MAP_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_MAP_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.error
      }
    }
  }
}
