import { call, takeLatest, put, select } from 'redux-saga/effects'
import { getAddress } from 'modules/wallet/reducer'
import { replace } from 'react-router-redux'
import { MANAToken } from 'decentraland-contracts'

import locations from '../../locations'

import {
  FETCH_WALLET_REQUEST,
  FETCH_WALLET_SUCCESS,
  FETCH_WALLET_FAILURE,
  FETCH_BALANCE_REQUEST,
  FETCH_BALANCE_SUCCESS,
  FETCH_BALANCE_FAILURE
} from './actions'
import {
  FETCH_ADDRESS_PARCELS_REQUEST,
  FETCH_ADDRESS_CONTRIBUTIONS_REQUEST
} from 'modules/address/actions'
import { FETCH_DISTRICTS_REQUEST } from 'modules/districts/actions'

import { connectEthereumWallet } from './utils'

export default function* saga() {
  yield takeLatest(FETCH_WALLET_REQUEST, handleWalletRequest)
  yield takeLatest(FETCH_WALLET_SUCCESS, handleWalletSuccess)
  yield takeLatest(FETCH_BALANCE_REQUEST, handleBalanceRequest)
}

function* handleWalletRequest(action = {}) {
  try {
    const wallet = yield call(() => connectEthereumWallet())

    const address = yield call(() => wallet.getAddress())

    yield put({
      type: FETCH_WALLET_SUCCESS,
      wallet: { address }
    })
  } catch (error) {
    console.error(error)
    yield put(replace(locations.walletError))
    yield put({ type: FETCH_WALLET_FAILURE, error: error.message })
  }
}

function* handleWalletSuccess(action) {
  const { address } = action.wallet
  yield put({ type: FETCH_ADDRESS_PARCELS_REQUEST, address })
  yield put({ type: FETCH_ADDRESS_CONTRIBUTIONS_REQUEST, address })
  yield put({ type: FETCH_DISTRICTS_REQUEST })
  yield put({ type: FETCH_BALANCE_REQUEST })
}

function* handleBalanceRequest(action) {
  try {
    const address = yield select(getAddress)
    const manaInstance = MANAToken.getInstance()
    const balance = yield call(() => manaInstance.balanceOf(address))

    yield put({
      type: FETCH_BALANCE_SUCCESS,
      wallet: { balance }
    })
  } catch (error) {
    console.error(error)
    yield put({ type: FETCH_BALANCE_FAILURE, error: error.message })
  }
}
