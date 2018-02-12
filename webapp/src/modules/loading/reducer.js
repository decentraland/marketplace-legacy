import { removeLast } from './utils'

const INITIAL_STATE = []

export function loadingReducer(state = INITIAL_STATE, action) {
  const type = action.type.slice(10) // ie. "Fetch Address Parcels"
  const status = action.type.slice(1, 8).toUpperCase() // REQUEST, SUCCESS, FAILURE
  switch (status) {
    case 'REQUEST': {
      return [
        ...state,
        {
          ...action,
          type
        }
      ]
    }
    case 'FAILURE':
    case 'SUCCESS': {
      return removeLast(state, item => item.type === type)
    }
    default:
      return state
  }
}
