import { takeLatest, takeEvery } from 'redux-saga/effects'
import { LOCATION_CHANGE } from 'react-router-redux'
import { CONNECT_WALLET_SUCCESS } from 'modules/wallet/actions'

export function* analyticsSaga() {
  yield takeLatest(CONNECT_WALLET_SUCCESS, handleConnectWalletSuccess)
  yield takeEvery(LOCATION_CHANGE, handleLocationChange)
}

// Identify users
function handleConnectWalletSuccess(action) {
  const { wallet } = action
  if (window.analytics) {
    window.analytics.identify(wallet.address)
  }
}

// Track pages
function handleLocationChange() {
  if (window.analytics) {
    window.analytics.page()
  }
}
