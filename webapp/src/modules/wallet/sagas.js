import { eth } from 'decentraland-eth'
import { delay } from 'redux-saga'
import {
  call,
  select,
  takeLatest,
  takeEvery,
  all,
  put
} from 'redux-saga/effects'
import { push } from 'react-router-redux'

import { locations } from 'locations'
import {
  CONNECT_WALLET_REQUEST,
  TRANSFER_MANA_REQUEST,
  BUY_MANA_REQUEST,
  UPDATE_DERIVATION_PATH,
  BUY_MANA_SUCCESS,
  connectWalletRequest,
  connectWalletSuccess,
  connectWalletFailure,
  transferManaSuccess,
  transferManaFailure,
  buyManaSuccess,
  buyManaFailure,
  updateBalance,
  updateEthBalance
} from './actions'
import { isLoading as isStorageLoading } from '@dapps/modules/storage/selectors'
import { FETCH_TRANSACTION_SUCCESS } from '@dapps/modules/transaction/actions'
import { fetchAddress } from 'modules/address/actions'
import { fetchAuthorizationRequest } from 'modules/authorization/actions'
import { isFeatureEnabled } from 'lib/featureUtils'
import { getData } from './selectors'
import { connectEthereumWallet, sendTransaction, fetchBalance } from './utils'

export function* walletSaga() {
  yield takeEvery(CONNECT_WALLET_REQUEST, handleConnectWalletRequest)
  yield takeLatest(TRANSFER_MANA_REQUEST, handleTransferManaRequest)
  yield takeLatest(BUY_MANA_REQUEST, handleBuyManaRequest)
  yield takeLatest(UPDATE_DERIVATION_PATH, handleUpdateDerivationPath)
  yield takeEvery(FETCH_TRANSACTION_SUCCESS, handleTransactionSuccess)
}

function* handleConnectWalletRequest(action = {}) {
  while (yield select(isStorageLoading)) yield delay(5)
  try {
    const walletData = yield select(getData)

    yield call(() =>
      connectEthereumWallet({
        address: walletData.address,
        derivationPath: walletData.derivationPath
      })
    )
    const manaTokenContract = eth.getContract('MANAToken')

    let address = yield call(() => eth.getAddress())
    address = address.toLowerCase()

    const [network, balance, ethBalance] = yield all([
      eth.getNetwork(),
      manaTokenContract.balanceOf(address),
      fetchBalance(address)
    ])

    const wallet = {
      network: network.name,
      type: eth.wallet.type,
      derivationPath: eth.wallet.derivationPath,
      address,
      balance,
      ethBalance
    }

    yield handleConnectWalletSuccess(address)
    yield put(connectWalletSuccess(wallet))
  } catch (error) {
    yield put(connectWalletFailure(error.message))
  }
}

function* handleConnectWalletSuccess(address) {
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
      const balance = yield call(() => manaTokenContract.balanceOf(address))
      const ethBalance = yield call(() => fetchBalance(address))

      yield put(updateBalance(balance))
      yield put(updateEthBalance(ethBalance))
      break
    }
    default:
      break
  }
  yield null
}
