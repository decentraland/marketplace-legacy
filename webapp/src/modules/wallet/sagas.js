import { call, takeLatest, all, put, select } from 'redux-saga/effects'
import { eth } from 'decentraland-commons'
import { replace } from 'react-router-redux'

import { locations } from 'locations'
import { getAddress } from './selectors'
import {
  CONNECT_WALLET_REQUEST,
  CONNECT_WALLET_SUCCESS,
  FETCH_WALLET_REQUEST,
  connectWalletSuccess,
  connectWalletFailure,
  fetchWalletRequest,
  fetchWalletSuccess,
  fetchWalletFailure
} from './actions'
import {
  fetchAddressParcelsRequest,
  fetchAddressContributionsRequest
} from 'modules/address/actions'
import { fetchDistrictsRequest } from 'modules/districts/actions'

import { connectEthereumWallet } from './utils'

export function* walletSaga() {
  yield takeLatest(CONNECT_WALLET_REQUEST, handleConnectWalletRequest)
  yield takeLatest(CONNECT_WALLET_SUCCESS, handleConnectWalletSuccess)
  yield takeLatest(FETCH_WALLET_REQUEST, handleWalletRequest)
}

function* handleConnectWalletRequest(action = {}) {
  try {
    yield call(() => connectEthereumWallet())

    const address = yield call(() => eth.getAddress())
    const wallet = { address }

    yield put(connectWalletSuccess(wallet))
  } catch (error) {
    yield put(replace(locations.walletError))
    yield put(connectWalletFailure(error.message))
  }
}

function* handleConnectWalletSuccess(action) {
  const { address } = action.wallet

  yield put(fetchAddressParcelsRequest(address))
  yield put(fetchAddressContributionsRequest(address))
  yield put(fetchDistrictsRequest())
  yield put(fetchWalletRequest())
}

function* handleWalletRequest(action) {
  try {
    const address = yield select(getAddress)

    const manaTokenContract = eth.getContract('MANAToken')
    const landRegistryContract = eth.getContract('LANDRegistry')
    const marketplaceContract = eth.getContract('Marketplace')

    const [balance, approvedBalance, landIsAuthorized] = yield all([
      manaTokenContract.getBalance(address),
      manaTokenContract.getAllowance(address, marketplaceContract.address),
      landRegistryContract.isOperatorAuthorizedBy(marketplaceContract.address)
    ])

    const wallet = { balance, approvedBalance, landIsAuthorized }

    yield put(fetchWalletSuccess(wallet))
  } catch (error) {
    yield put(fetchWalletFailure(error.message))
  }
}
