import * as storage from 'redux-storage'
import createStorageEngine from 'redux-storage-engine-localstorage'
import filter from 'redux-storage-decorator-filter'

import {
  FETCH_TRANSACTION_REQUEST,
  FETCH_TRANSACTION_SUCCESS,
  FETCH_TRANSACTION_FAILURE
} from 'modules/transaction/actions'

export function createStorageMiddleware(storageKey) {
  const storageEngine = filter(createStorageEngine(storageKey), ['transaction'])

  const storageMiddleware = storage.createMiddleware(
    storageEngine,
    [],
    [
      FETCH_TRANSACTION_REQUEST,
      FETCH_TRANSACTION_SUCCESS,
      FETCH_TRANSACTION_FAILURE
    ]
  )

  // Yes, this is a bit shady.
  // We're delegating the responsability of loading the middleware to the middleware itself.
  // To avoid returning two things from the same function, we add a new prop to the middleware object.
  // This will blow up if redux-storage decides to add a `load` prop to its middleware.
  if (typeof storageMiddleware.load !== 'undefined') {
    throw new Error(
      'Whoops, the `load` prop already exists on the storage middleware'
    )
  }

  storageMiddleware.load = store => storage.createLoader(storageEngine)(store)

  return storageMiddleware
}
