import { SET_LOADING } from './actions'

const INITIAL_STATE = false

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_LOADING:
      return action.value
    default:
      return state
  }
}

export const isLoading = state => state.ui.loading
