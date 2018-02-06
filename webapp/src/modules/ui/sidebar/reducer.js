import { OPEN_SIDEBAR, CLOSE_SIDEBAR } from './actions'

const INITIAL_STATE = {
  open: false
}

export function sidebarReducer(state = INITIAL_STATE, action) {
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
