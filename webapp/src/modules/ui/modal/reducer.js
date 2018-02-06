import { OPEN_MODAL, CLOSE_MODAL } from './actions'

const INITIAL_STATE = {
  open: false,
  name: '',
  data: null
}

export function modalReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case OPEN_MODAL: {
      const { name, data } = action
      return {
        open: true,
        name,
        data
      }
    }
    case CLOSE_MODAL: {
      return INITIAL_STATE
    }
    default:
      return state
  }
}
