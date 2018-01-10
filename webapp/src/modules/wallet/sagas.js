import { call, takeLatest, put } from 'redux-saga/effects'
import { replace } from 'react-router-redux'

import locations from '../../locations'

import {
  FETCH_WALLET_REQUEST,
  FETCH_WALLET_SUCCESS,
  FETCH_WALLET_FAILURE
} from './actions'
import { FETCH_ADDRESS_PARCELS_REQUEST } from 'modules/address/actions'
import { FETCH_DISTRICTS_REQUEST } from 'modules/districts/actions'

import { connectEthereumWallet } from './utils'

export default function* saga() {
  yield takeLatest(FETCH_WALLET_REQUEST, handleWalletRequest)
  yield takeLatest(FETCH_WALLET_SUCCESS, handleWalletSuccess)
}

// Defined on `connectEthereumWallet`
let wallet = null

function* handleWalletRequest(action = {}) {
  try {
    wallet = yield call(() => connectEthereumWallet())

    const address = yield call(() => wallet.getAddress())

    yield put({
      type: FETCH_WALLET_SUCCESS,
      wallet: { address }
    })
  } catch (error) {
    yield put(replace(locations.walletError))
    yield put({ type: FETCH_WALLET_FAILURE, error: error.message })
  }
}

function* handleWalletSuccess(action) {
  const { address } = action.wallet

  yield put({ type: FETCH_ADDRESS_PARCELS_REQUEST, address })
  yield put({ type: FETCH_DISTRICTS_REQUEST })
}
