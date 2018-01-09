import { compose, createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'react-router-redux'

import createHistory from 'history/createBrowserHistory'
import createSagasMiddleware from 'redux-saga'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'

import { createGoogleAnalyticsMiddleware } from './analyticsMiddleware'

import reducer, { analytics } from './reducers'
import rootSaga from './sagas'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const history = createHistory()

const historyMiddleware = routerMiddleware(history)
const sagasMiddleware = createSagasMiddleware()
const analyticsMiddleware = createGoogleAnalyticsMiddleware(analytics)
const loggerMiddleware = createLogger({ collapsed: () => true })

const middleware = applyMiddleware(
  thunkMiddleware,
  loggerMiddleware,
  sagasMiddleware,
  historyMiddleware,
  analyticsMiddleware
)
const enhancer = composeEnhancers(middleware)
const store = createStore(reducer, enhancer)

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

export { history, store }
