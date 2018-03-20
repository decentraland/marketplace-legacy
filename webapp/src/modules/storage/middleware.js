import * as storage from 'redux-storage'
import createStorageEngine from 'redux-storage-engine-localstorage'
import filter from 'redux-storage-decorator-filter'
import { env } from 'decentraland-commons'

import {
  FETCH_TRANSACTION_REQUEST,
  FETCH_TRANSACTION_SUCCESS,
  FETCH_TRANSACTION_FAILURE
} from 'modules/transaction/actions'
import {
  CHANGE_LOCALE,
  FETCH_TRANSLATIONS_SUCCESS
} from 'modules/translation/actions'
import { UPDATE_DERIVATION_PATH } from 'modules/wallet/actions'

export function createMainStorageMiddleware() {
  const storageKey = env.get(
    'REACT_APP_LOCAL_STORAGE_KEY',
    'decentraland-marketplace'
  )
  return createStorageMiddleware(storageKey, {
    whitelist: {
      state: [
        'transaction',
        ['wallet', 'data', 'locale'],
        ['wallet', 'data', 'derivationPath']
      ],
      actions: [
        FETCH_TRANSACTION_REQUEST,
        FETCH_TRANSACTION_SUCCESS,
        FETCH_TRANSACTION_FAILURE,
        UPDATE_DERIVATION_PATH
      ]
    }
  })
}

export function createTransactionStorageMiddleware() {
  const storageKey = env.get(
    'REACT_APP_TRANSLATIONS_LOCAL_STORAGE_KEY',
    'decentraland-marketplace-translations'
  )
  return createStorageMiddleware(storageKey, {
    whitelist: {
      state: [['translation', 'data']],
      actions: [CHANGE_LOCALE, FETCH_TRANSLATIONS_SUCCESS]
    }
  })
}

export function createStorageMiddleware(storageKey, options = {}) {
  const { whitelist = {}, blacklist = {} } = options

  const storageEngine = filter(
    createStorageEngine(storageKey),
    whitelist.state,
    blacklist.state
  )

  const storageMiddleware = storage.createMiddleware(
    storageEngine,
    blacklist.actions,
    whitelist.actions
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
