import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'

import { env } from 'decentraland-commons'

import Routes from './Routes'
import { store, history } from './store'

import './index.css'
import './rollbar'

env.load()

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Routes />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
)
