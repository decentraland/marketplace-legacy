import 'babel-polyfill'
import 'themes'
import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import TranslationProvider from '@dapps/providers/TranslationProvider'
import WalletProvider from '@dapps/providers/WalletProvider'

import { env } from 'decentraland-commons'

import { store, history } from './store'
import Routes from './Routes'
import { getAvailableLocales } from './lib/translation'
import { track } from './modules/analytics/track'

import './index.css'

env.load()
track()

if (!env.isDevelopment()) {
  require('./rollbar')
}

ReactDOM.render(
  <Provider store={store}>
    <TranslationProvider locales={getAvailableLocales()}>
      <WalletProvider>
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
      </WalletProvider>
    </TranslationProvider>
  </Provider>,
  document.getElementById('app')
)
