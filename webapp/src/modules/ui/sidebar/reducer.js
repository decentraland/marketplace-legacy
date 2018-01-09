import { OPEN_SIDEBAR, CLOSE_SIDEBAR } from './actions'

const INITIAL_STATE = {
  open: false
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case OPEN_SIDEBAR:
      return {
        open: true
      }
    case CLOSE_SIDEBAR:
      return INITIAL_STATE
    default:
      return state
  }
}

export const getState = state => state.ui.sidebar
export const isOpen = state => getState(state).open
