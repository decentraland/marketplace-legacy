import { delay } from 'redux-saga'
import {
  call,
  select,
  takeLatest,
  takeEvery,
  all,
  put
} from 'redux-saga/effects'
import { eth } from 'decentraland-commons'
import {
  CONNECT_WALLET_REQUEST,
  APPROVE_MANA_REQUEST,
  AUTHORIZE_LAND_REQUEST,
  UPDATE_DERIVATION_PATH,
  connectWalletRequest,
  connectWalletSuccess,
  connectWalletFailure,
  approveManaSuccess,
  approveManaFailure,
  authorizeLandSuccess,
  authorizeLandFailure
} from './actions'
import { getData } from './selectors'
import { isLoading as isStorageLoading } from 'modules/storage/selectors'
import { fetchAddress } from 'modules/address/actions'
import { fetchDistrictsRequest } from 'modules/districts/actions'
import { watchLoadingTransactions } from 'modules/transaction/actions'

import { connectEthereumWallet, getMarketplaceAddress } from './utils'

export function* walletSaga() {
  yield takeEvery(CONNECT_WALLET_REQUEST, handleConnectWalletRequest)
  yield takeLatest(APPROVE_MANA_REQUEST, handleApproveManaRequest)
  yield takeLatest(AUTHORIZE_LAND_REQUEST, handleAuthorizeLandRequest)
  yield takeLatest(UPDATE_DERIVATION_PATH, handleUpdateDerivationPath)
}

function* handleConnectWalletRequest(action = {}) {
  while (yield select(isStorageLoading)) yield delay(5)
  try {
    yield put(fetchDistrictsRequest())
    if (!eth.isConnected()) {
      const { derivationPath } = yield select(getData)

      yield call(() =>
        connectEthereumWallet({
          derivationPath
        })
      )
    }

    let address = yield call(() => eth.getAddress())
    address = address.toLowerCase()

    const manaTokenContract = eth.getContract('MANAToken')
    const landRegistryContract = eth.getContract('LANDRegistry')
    const marketplaceAddress = getMarketplaceAddress()

    const [balance, approvedBalance, isLandAuthorized] = yield all([
      manaTokenContract.balanceOf(address),
      manaTokenContract.allowance(address, marketplaceAddress),
      landRegistryContract.isOperatorAuthorizedFor(marketplaceAddress, address)
    ])

    const { type, derivationPath } = eth.getWalletAttributes()

    const wallet = {
      address,
      balance,
      approvedBalance,
      isLandAuthorized,
      type,
      derivationPath
    }
    yield handleConnectWalletSuccess(address)
    yield put(connectWalletSuccess(wallet))
  } catch (error) {
    yield put(connectWalletFailure(error.message))
  }
}

function* handleConnectWalletSuccess(address) {
  yield put(fetchAddress(address))
  yield put(watchLoadingTransactions())
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

function* handleUpdateDerivationPath(action) {
  eth.disconnect()
  yield put(connectWalletRequest())
}
