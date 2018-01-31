import { CHANGE_RANGE, SELECT_PARCEL } from './actions'

const INITIAL_STATE = {
  selected: null,
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
      const { nw, se } = action
      return {
        ...state,
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

export const getState = state => state.ui.map
export const getRange = state => getState(state).range
export const getSelected = state => getState(state).selected
