import { compose, createStore, combineReducers, applyMiddleware } from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'

import createHistory from 'history/createBrowserHistory'
import createSagasMiddleware from 'redux-saga'
import reduxThunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

import { createGoogleAnalyticsMiddleware } from './analyticsMiddleware'

import reducers, { analytics } from './reducers'
import rootSaga from './sagas'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const logger = createLogger({ collapsed: () => true })

// dispatch navigation actions from anywhere! like this: store.dispatch(push(locations.root))
const history = createHistory()
const historyMiddleware = routerMiddleware(history)

const sagasMiddleware = createSagasMiddleware()

const analyticsMiddleware = createGoogleAnalyticsMiddleware(analytics)

const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer
  }),

  composeEnhancers(
    applyMiddleware(
      reduxThunk,
      logger,
      sagasMiddleware,
      historyMiddleware,
      analyticsMiddleware
    )
  )
)

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
