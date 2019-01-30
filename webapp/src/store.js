import { compose, createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import { env } from 'decentraland-commons'
import { createAnalyticsMiddleware } from '@dapps/modules/analytics/middleware'
import { createTransactionMiddleware } from '@dapps/modules/transaction/middleware'
import { createStorageMiddleware } from '@dapps/modules/storage/middleware'

import createHistory from 'history/createBrowserHistory'
import createSagasMiddleware from 'redux-saga'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

import { api } from 'lib/api'

import { SET_ON_CHAIN_PARCEL_OWNER } from 'modules/auction/actions'

import { migrations } from 'lib/localStorage'
import { etherscan } from 'lib/EtherscanAPI'

import { rootReducer } from './reducer'
import { rootSaga } from './sagas'

const onlyTypesForActions = env.get(
  'REACT_APP_DEVTOOLS_EXTENSION_ACTION_ONLY_SHOW_TYPE',
  false
)
const storeKeys = env.get('REACT_APP_DEVTOOLS_EXTENSION_STORE_KEYS', '')

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      actionSanitizer: action =>
        onlyTypesForActions ? { type: action.type } : action,
      stateSanitizer: state =>
        storeKeys.length > 0
          ? storeKeys.split(',').reduce((sanitizedState, key) => {
              const value = state[key]
              if (value) {
                return { ...sanitizedState, [key]: value }
              }
              return sanitizedState
            }, {})
          : state
    })
  : compose

const history = createHistory()

const historyMiddleware = routerMiddleware(history)
const sagasMiddleware = createSagasMiddleware()
const loggerMiddleware = createLogger({
  predicate: (_, action) =>
    env.isDevelopment() || action.type.includes('Failure'),
  collapsed: () => true
})
const transactionMiddleware = createTransactionMiddleware()
const analyticsMiddleware = createAnalyticsMiddleware(
  env.get('REACT_APP_SEGMENT_API_KEY')
)

const { storageMiddleware, loadStorageMiddleware } = createStorageMiddleware({
  migrations,
  paths: [['auction', 'parcelOnChainOwners']],
  action: [SET_ON_CHAIN_PARCEL_OWNER],
  storageKey: env.get('REACT_APP_LOCAL_STORAGE_KEY')
})

const middleware = applyMiddleware(
  thunk.withExtraArgument(api),
  storageMiddleware,
  historyMiddleware,
  sagasMiddleware,
  loggerMiddleware,
  transactionMiddleware,
  analyticsMiddleware
)
const enhancer = composeEnhancers(middleware)
const store = createStore(rootReducer, enhancer)

etherscan.setStore(store)
sagasMiddleware.run(rootSaga)
loadStorageMiddleware(store)

export function dispatch(action) {
  if (typeof action === 'string') {
    store.dispatch({ type: action })
  } else {
    store.dispatch(action)
  }
}

export function getState() {
  return store.getState()
}

if (env.isDevelopment()) {
  window.getState = store.getState
}

export { history, store }
