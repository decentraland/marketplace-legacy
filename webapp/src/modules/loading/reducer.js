import { getType, getStatus, removeLast } from './utils'

const INITIAL_STATE = []

export function loadingReducer(state = INITIAL_STATE, action) {
  const type = getType(action) // ie. "Fetch Address Parcels"
  const status = getStatus(action) // REQUEST, SUCCESS, FAILURE
  switch (status) {
    case 'REQUEST': {
      return [...state, action]
    }
    case 'FAILURE':
    case 'SUCCESS': {
      return removeLast(state, item => getType(item) === type)
    }
    default:
      return state
  }
}
