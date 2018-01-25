import { compose, createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import { env } from 'decentraland-commons'

import createHistory from 'history/createBrowserHistory'
import createSagasMiddleware from 'redux-saga'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

import api from 'lib/api'
import localStorage from 'lib/localStorage'
import { createGoogleAnalyticsMiddleware } from './analyticsMiddleware'

import reducer, { analytics } from './reducer'
import rootSaga from './sagas'

import { openModal } from 'modules/ui/actions'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const history = createHistory()

const historyMiddleware = routerMiddleware(history)
const sagasMiddleware = createSagasMiddleware()
const analyticsMiddleware = createGoogleAnalyticsMiddleware(analytics)
const loggerMiddleware = createLogger({ collapsed: () => true })

const middleware = applyMiddleware(
  thunk.withExtraArgument(api),
  loggerMiddleware,
  sagasMiddleware,
  historyMiddleware,
  analyticsMiddleware
)
const enhancer = composeEnhancers(middleware)
const store = createStore(reducer, enhancer)

sagasMiddleware.run(rootSaga)

if (!localStorage.getItem('seenIntroModal')) {
  store.dispatch(openModal('IntroModal'))
  localStorage.setItem('seenIntroModal', new Date().getTime())
}

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
