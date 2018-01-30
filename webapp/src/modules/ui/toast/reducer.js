import { utils } from 'decentraland-commons'
import { OPEN_TOAST, CLOSE_TOAST } from './actions'

const INITIAL_STATE = {
  // id, kind, message, delay
}

export function toastReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case OPEN_TOAST: {
      return {
        ...state,
        [action.id]: utils.pick(action, ['id', 'kind', 'message', 'delay'])
      }
    }
    case CLOSE_TOAST: {
      return utils.omit(state, action.id)
    }
    default:
      return state
  }
}

export const getToasts = state => state.ui.toast
