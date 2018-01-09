import {
  FETCH_DISTRICTS_REQUEST,
  FETCH_DISTRICTS_SUCCESS,
  FETCH_DISTRICTS_FAILURE
} from './actions'

const INITIAL_STATE = {
  loading: true
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_DISTRICTS_REQUEST:
      return { loading: true }
    case FETCH_DISTRICTS_SUCCESS:
      return { loading: false, error: null, data: action.districts }
    case FETCH_DISTRICTS_FAILURE:
      return { ...state, loading: false, error: action.error }
    default:
      return state
  }
}

export const getState = state => state.districts
export const getDistricts = state => getState(state).data
