import 'babel-polyfill'
import 'themes'
import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import TranslationProvider from '@dapps/providers/TranslationProvider'

import { env } from 'decentraland-commons'

import { store, history } from './store'
import Routes from './Routes'
import { getAvailableLocales } from './lib/translation'
import { track } from './modules/analytics/track'

import './rollbar'
import './index.css'

env.load()
track()

ReactDOM.render(
  <Provider store={store}>
    <TranslationProvider locales={getAvailableLocales()}>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </TranslationProvider>
  </Provider>,
  document.getElementById('app')
)
