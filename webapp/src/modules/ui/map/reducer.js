import { CHANGE_RANGE, SELECT_PARCEL } from './actions'

const INITIAL_STATE = {
  selected: null,
  center: {
    x: 0,
    y: 0
  },
  range: {
    nw: {
      x: 0,
      y: 0
    },
    se: {
      x: 0,
      y: 0
    }
  }
}

export function mapReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SELECT_PARCEL: {
      const { x, y } = action
      return {
        ...state,
        selected: isNaN(x) || isNaN(y) ? null : { x, y }
      }
    }
    case CHANGE_RANGE: {
      const { center, nw, se } = action
      return {
        ...state,
        center,
        range: {
          nw,
          se
        }
      }
    }
    default:
      return state
  }
}
