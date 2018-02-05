import { call, takeLatest, put, select } from 'redux-saga/effects'
import { eth } from 'decentraland-commons'
import { replace } from 'react-router-redux'

import { locations } from 'locations'
import { getAddress } from 'modules/wallet/reducer'
import {
  FETCH_WALLET_REQUEST,
  FETCH_WALLET_SUCCESS,
  FETCH_BALANCE_REQUEST,
  fetchWalletSuccess,
  fetchWalletFailure,
  fetchBalanceRequest,
  fetchBalanceSuccess,
  fetchBalanceFailure
} from './actions'
import {
  fetchAddressParcelsRequest,
  fetchAddressContributionsRequest
} from 'modules/address/actions'
import { fetchDistrictsRequest } from 'modules/districts/actions'

import { connectEthereumWallet } from './utils'

export function* walletSaga() {
  yield takeLatest(FETCH_WALLET_REQUEST, handleWalletRequest)
  yield takeLatest(FETCH_WALLET_SUCCESS, handleWalletSuccess)
  yield takeLatest(FETCH_BALANCE_REQUEST, handleBalanceRequest)
}

function* handleWalletRequest(action = {}) {
  try {
    yield call(() => connectEthereumWallet())
    const address = yield call(() => eth.getAddress())
    const wallet = { address }
    yield put(fetchWalletSuccess(wallet))
  } catch (error) {
    yield put(replace(locations.walletError))
    yield put(fetchWalletFailure(error.message))
  }
}

function* handleWalletSuccess(action) {
  const { address } = action.wallet

  yield put(fetchAddressParcelsRequest(address))
  yield put(fetchAddressContributionsRequest(address))
  yield put(fetchDistrictsRequest())
  yield put(fetchBalanceRequest())
}

function* handleBalanceRequest(action) {
  try {
    const address = yield select(getAddress)
    const contract = eth.getContract('MANAToken')
    const balance = yield call(() => contract.getBalance(address))
    const wallet = { balance }
    yield put(fetchBalanceSuccess(wallet))
  } catch (error) {
    yield put(fetchBalanceFailure(error.message))
  }
}
