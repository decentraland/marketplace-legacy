import 'babel-polyfill'
import 'themes'
import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'

import { env } from 'decentraland-commons'

import Routes from './Routes'
import { store, history } from './store'

import './rollbar'
import './index.css'

env.load()

// TEMPORAL CODE
// Trims down the stored local storage to avoid hitting the browser limit
try {
  if (!window.localStorage.getItem('__clean__')) {
    const stateString = window.localStorage.getItem('decentraland-marketplace')

    if (stateString) {
      const state = JSON.parse(stateString)
      const transaction = state.transaction

      if (transaction && transaction.data) {
        transaction.data = transaction.data.map(tx => ({
          hash: tx.hash,
          payload: tx.payload,
          timestamp: tx.timestamp,
          from: tx.from,
          actionType: tx.actionType,
          status: tx.status
        }))

        window.localStorage.setItem(
          'decentraland-marketplace',
          JSON.stringify(state)
        )
      }
    }

    window.localStorage.removeItem('decentraland-marketplace-translations')
    window.localStorage.setItem('__clean__', 1)
  }
} catch (error) {
  window.Rollbar.info('Failed to clean the user localstorage', error)
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Routes />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
)
