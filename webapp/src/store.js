import { compose, createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import { env } from 'decentraland-commons'

import createHistory from 'history/createBrowserHistory'
import createSagasMiddleware from 'redux-saga'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

import { api } from 'lib/api'
import {
  createGoogleAnalyticsMiddleware,
  createTransactionMiddleware
} from 'middleware'

import { rootReducer, analytics } from './reducer'
import { rootSaga } from './sagas'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const history = createHistory()

const historyMiddleware = routerMiddleware(history)
const sagasMiddleware = createSagasMiddleware()
const loggerMiddleware = createLogger({ collapsed: () => true })
const transactionMiddleware = createTransactionMiddleware()
const analyticsMiddleware = createGoogleAnalyticsMiddleware(analytics)

const middleware = applyMiddleware(
  thunk.withExtraArgument(api),
  historyMiddleware,
  sagasMiddleware,
  loggerMiddleware,
  transactionMiddleware,
  analyticsMiddleware
)
const enhancer = composeEnhancers(middleware)
const store = createStore(rootReducer, enhancer)

sagasMiddleware.run(rootSaga)

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
