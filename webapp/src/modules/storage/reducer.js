import * as storage from 'redux-storage'
import { STORAGE_LOAD } from './actions'

const INITIAL_STATE = {
  loading: true
}

export function storageReducerWrapper(reducer, merger) {
  return storage.reducer(reducer, merger)
}

export function storageReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case STORAGE_LOAD:
      return {
        loading: false
      }
    default:
      return state
  }
}
