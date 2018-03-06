import * as storage from 'redux-storage'

export function storageReducer(reducer, merger) {
  return storage.reducer(reducer, merger)
}
