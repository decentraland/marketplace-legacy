import { eth } from 'decentraland-eth'
import { delay } from 'redux-saga'
import { call, fork, takeLatest, takeEvery, all, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import { locations } from 'locations'
import { createWalletSaga } from '@dapps/modules/wallet/sagas'
import {
  CONNECT_WALLET_SUCCESS,
  connectWalletRequest
} from '@dapps/modules/wallet/actions'
import {
  TRANSFER_MANA_REQUEST,
  BUY_MANA_REQUEST,
  UPDATE_DERIVATION_PATH,
  BUY_MANA_SUCCESS,
  transferManaSuccess,
  transferManaFailure,
  buyManaSuccess,
  buyManaFailure,
  updateManaBalance,
  updateEthBalance
} from './actions'
import { FETCH_TRANSACTION_SUCCESS } from '@dapps/modules/transaction/actions'
import { fetchAddress } from 'modules/address/actions'
import { fetchAuthorizationRequest } from 'modules/authorization/actions'
import { isFeatureEnabled } from 'lib/featureUtils'
import { getWalletSagaOptions, sendTransaction, fetchBalance } from './utils'

const baseWalletSaga = createWalletSaga(getWalletSagaOptions())

export function* walletSaga() {
  yield all([baseWalletSaga(), fullWalletSaga()])
}

function* fullWalletSaga() {
  yield takeEvery(CONNECT_WALLET_SUCCESS, handleConnectWalletSuccess)
  yield takeLatest(TRANSFER_MANA_REQUEST, handleTransferManaRequest)
  yield takeLatest(BUY_MANA_REQUEST, handleBuyManaRequest)
  yield takeLatest(UPDATE_DERIVATION_PATH, handleUpdateDerivationPath)
  yield takeEvery(FETCH_TRANSACTION_SUCCESS, handleTransactionSuccess)
}

function* handleConnectWalletSuccess(action) {
  const { address } = action.payload.wallet

  const authorization = {
    allowances: {
      Marketplace: ['MANAToken'],
      LegacyMarketplace: ['MANAToken']
    },
    approvals: {
      Marketplace: ['LANDRegistry', 'EstateRegistry']
    }
  }
  if (isFeatureEnabled('MORTGAGES')) {
    Object.assign(authorization.allowances, {
      MortgageHelper: ['MANAToken'],
      MortgageManager: ['RCNToken']
    })
  }

  yield put(fetchAddress(address))
  yield put(fetchAuthorizationRequest(address, authorization))

  yield fork(refreshEthBalance, address)
}

function* handleTransferManaRequest(action) {
  try {
    const { address, mana } = action
    const manaTokenContract = eth.getContract('MANAToken')

    const manaWei = eth.utils.toWei(mana)

    const txHash = yield call(() =>
      manaTokenContract.transfer(address, manaWei)
    )

    yield put(transferManaSuccess(txHash, address, mana))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(transferManaFailure(error.message))
  }
}

function* handleBuyManaRequest(action) {
  try {
    const { mana, tx } = action
    const txHash = yield call(() => sendTransaction(tx))
    yield put(buyManaSuccess(txHash, mana))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(buyManaFailure(error.message))
  }
}

function* handleUpdateDerivationPath(action) {
  eth.disconnect()
  yield put(connectWalletRequest())
}

function* handleTransactionSuccess(action) {
  const { transaction } = action.payload
  switch (transaction.actionType) {
    case BUY_MANA_SUCCESS: {
      yield delay(5000) // 5 seconds of delay to get new balances

      let address = yield call(() => eth.getAddress())
      address = address.toLowerCase()

      const manaTokenContract = eth.getContract('MANAToken')
      const mana = yield call(() => manaTokenContract.balanceOf(address))
      const ethBalance = yield call(() => fetchBalance(address))

      yield put(updateManaBalance(mana))
      yield put(updateEthBalance(ethBalance))
      break
    }
    default:
      break
  }
  yield null
}

function* refreshEthBalance(address) {
  const ethBalance = yield call(() => fetchBalance(address))
  yield put(updateEthBalance(ethBalance))
}
