import { call, takeLatest, takeEvery, all, put } from 'redux-saga/effects'
import { eth } from 'decentraland-commons'
import { replace } from 'react-router-redux'

import { locations } from 'locations'
import {
  CONNECT_WALLET_REQUEST,
  APPROVE_MANA_REQUEST,
  AUTHORIZE_LAND_REQUEST,
  connectWalletSuccess,
  connectWalletFailure,
  approveManaSuccess,
  approveManaFailure,
  authorizeLandSuccess,
  authorizeLandFailure
} from './actions'
import { fetchAddress } from 'modules/address/actions'
import { fetchDistrictsRequest } from 'modules/districts/actions'

import { connectEthereumWallet, getMarketplaceAddress } from './utils'

export function* walletSaga() {
  yield takeEvery(CONNECT_WALLET_REQUEST, handleConnectWalletRequest)
  yield takeLatest(APPROVE_MANA_REQUEST, handleApproveManaRequest)
  yield takeLatest(AUTHORIZE_LAND_REQUEST, handleAuthorizeLandRequest)
}

function* handleConnectWalletRequest(action = {}) {
  try {
    if (!eth.isConnected()) {
      yield call(() => connectEthereumWallet())
    }

    const address = yield call(() => eth.getAddress())

    const manaTokenContract = eth.getContract('MANAToken')
    const landRegistryContract = eth.getContract('LANDRegistry')
    const marketplaceAddress = getMarketplaceAddress()

    const [balance, approvedBalance, isLandAuthorized] = yield all([
      manaTokenContract.getBalance(address),
      manaTokenContract.getAllowance(address, marketplaceAddress),
      landRegistryContract.isOperatorAuthorizedFor(marketplaceAddress, address)
    ])

    const wallet = { address, balance, approvedBalance, isLandAuthorized }

    yield handleConnectWalletSuccess(address)
    yield put(connectWalletSuccess(wallet))
  } catch (error) {
    yield put(replace(locations.walletError))
    yield put(connectWalletFailure(error.message))
  }
}

function* handleConnectWalletSuccess(address) {
  yield put(fetchAddress(address))
  yield put(fetchDistrictsRequest())
}

function* handleApproveManaRequest(action) {
  try {
    const mana = action.mana
    const manaTokenContract = eth.getContract('MANAToken')

    const txHash = yield call(() =>
      manaTokenContract.approve(getMarketplaceAddress(), mana)
    )

    yield put(approveManaSuccess(txHash, mana))
  } catch (error) {
    yield put(approveManaFailure(error.message))
  }
}

function* handleAuthorizeLandRequest(action) {
  try {
    const isAuthorized = action.isAuthorized
    const landRegistryContract = eth.getContract('LANDRegistry')

    const txHash = yield call(() =>
      landRegistryContract.authorizeOperator(
        getMarketplaceAddress(),
        isAuthorized
      )
    )

    yield put(authorizeLandSuccess(txHash, isAuthorized))
  } catch (error) {
    yield put(authorizeLandFailure(error.message))
  }
}
