import { call, takeLatest, all, put } from 'redux-saga/effects'
import { eth } from 'decentraland-commons'
import { replace } from 'react-router-redux'

import { locations } from 'locations'
import {
  CONNECT_WALLET_REQUEST,
  CONNECT_WALLET_SUCCESS,
  APPROVE_MANA_REQUEST,
  connectWalletSuccess,
  connectWalletFailure,
  approveManaSuccess,
  approveManaFailure
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
  yield takeLatest(APPROVE_MANA_REQUEST, handleApproveManaRequest)
}

function* handleConnectWalletRequest(action = {}) {
  try {
    yield call(() => connectEthereumWallet())

    const address = yield call(() => eth.getAddress())

    const manaTokenContract = eth.getContract('MANAToken')
    const marketplaceContract = eth.getContract('Marketplace')
    // const landRegistryContract = eth.getContract('LANDRegistry')

    const [balance, approvedBalance, landIsAuthorized] = yield all([
      manaTokenContract.getBalance(address),
      manaTokenContract.getAllowance(address, marketplaceContract.address),
      // landRegistryContract.isOperatorAuthorizedBy(marketplaceContract.address)
      false
    ])

    const wallet = { address, balance, approvedBalance, landIsAuthorized }

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
}

function* handleApproveManaRequest(action) {
  try {
    const mana = action.mana
    const manaTokenContract = eth.getContract('MANAToken')
    const marketplaceContract = eth.getContract('Marketplace')

    const txHash = yield call(() =>
      manaTokenContract.approve(marketplaceContract.address, mana)
    )

    yield put(approveManaSuccess(mana, txHash))
  } catch (error) {
    yield put(approveManaFailure(error.message))
  }
}
