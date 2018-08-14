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
import { eth } from 'decentraland-eth'
import { FETCH_TRANSACTION_SUCCESS } from 'modules/transaction/actions'
import {
  CONNECT_WALLET_REQUEST,
  APPROVE_MANA_REQUEST,
  AUTHORIZE_LAND_REQUEST,
  TRANSFER_MANA_REQUEST,
  BUY_MANA_REQUEST,
  UPDATE_DERIVATION_PATH,
  BUY_MANA_SUCCESS,
  APPROVE_MORTGAGE_FOR_MANA_REQUEST,
  APPROVE_MORTGAGE_FOR_RCN_REQUEST,
  connectWalletRequest,
  connectWalletSuccess,
  connectWalletFailure,
  approveManaSuccess,
  approveManaFailure,
  authorizeLandSuccess,
  authorizeLandFailure,
  transferManaSuccess,
  transferManaFailure,
  buyManaSuccess,
  buyManaFailure,
  updateBalance,
  updateEthBalance,
  approveMortgageForManaSuccess,
  approveMortgageForManaFailure,
  approveMortgageForRCNSuccess,
  approveMortgageForRCNFailure
} from './actions'
import { getData } from './selectors'
import { locations } from 'locations'
import { isLoading as isStorageLoading } from 'modules/storage/selectors'
import { fetchAddress } from 'modules/address/actions'
import { watchLoadingTransactions } from 'modules/transaction/actions'
import {
  connectEthereumWallet,
  getMarketplaceAddress,
  getMortgageHelperAddress,
  getMortgageManagerAddress,
  sendTransaction,
  fetchBalance
} from './utils'

export function* walletSaga() {
  yield takeEvery(CONNECT_WALLET_REQUEST, handleConnectWalletRequest)
  yield takeLatest(APPROVE_MANA_REQUEST, handleApproveManaRequest)
  yield takeLatest(AUTHORIZE_LAND_REQUEST, handleAuthorizeLandRequest)
  yield takeLatest(TRANSFER_MANA_REQUEST, handleTransferManaRequest)
  yield takeLatest(BUY_MANA_REQUEST, handleBuyManaRequest)
  yield takeLatest(UPDATE_DERIVATION_PATH, handleUpdateDerivationPath)
  yield takeLatest(
    APPROVE_MORTGAGE_FOR_MANA_REQUEST,
    handleApproveMortgageForManaRequest
  )
  yield takeLatest(
    APPROVE_MORTGAGE_FOR_RCN_REQUEST,
    handleApproveMortgageForRCNRequest
  )
  yield takeEvery(FETCH_TRANSACTION_SUCCESS, handleTransactionSuccess)
}

function* handleConnectWalletRequest(action = {}) {
  while (yield select(isStorageLoading)) yield delay(5)
  try {
    if (!eth.isConnected()) {
      const { address, derivationPath } = yield select(getData)

      yield call(() =>
        connectEthereumWallet({
          address,
          derivationPath
        })
      )
    }

    let address = yield call(() => eth.getAddress())
    address = address.toLowerCase()

    const manaTokenContract = eth.getContract('MANAToken')
    const landRegistryContract = eth.getContract('LANDRegistry')
    const rcnTokenContract = eth.getContract('RCNToken')
    const marketplaceAddress = getMarketplaceAddress()
    const mortgageHelperAddress = getMortgageHelperAddress()
    const mortgageManagerAddress = getMortgageManagerAddress()

    const [
      network,
      balance,
      ethBalance,
      approvedBalance,
      isLandAuthorized,
      mortgageManaAllowance,
      mortgageRCNAllowance
    ] = yield all([
      eth.getNetwork(),
      manaTokenContract.balanceOf(address),
      fetchBalance(address),
      manaTokenContract.allowance(address, marketplaceAddress),
      landRegistryContract.isApprovedForAll(marketplaceAddress, address),
      manaTokenContract.allowance(address, mortgageHelperAddress),
      rcnTokenContract.allowance(address, mortgageManagerAddress)
    ])
    const wallet = {
      network: network.name,
      type: eth.wallet.type,
      derivationPath: eth.wallet.derivationPath,
      address,
      balance,
      ethBalance,
      approvedBalance,
      isLandAuthorized,
      isMortgageApprovedForMana: mortgageManaAllowance > 0,
      isMortgageApprovedForRCN: mortgageRCNAllowance > 0
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
      landRegistryContract.setApprovalForAll(
        getMarketplaceAddress(),
        isAuthorized
      )
    )

    yield put(authorizeLandSuccess(txHash, isAuthorized))
  } catch (error) {
    yield put(authorizeLandFailure(error.message))
  }
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
    yield put(push(locations.activity))
  } catch (error) {
    yield put(transferManaFailure(error.message))
  }
}

function* handleBuyManaRequest(action) {
  try {
    const { mana, tx } = action
    const txHash = yield call(() => sendTransaction(tx))
    yield put(buyManaSuccess(txHash, mana))
    yield put(push(locations.activity))
  } catch (error) {
    yield put(buyManaFailure(error.message))
  }
}

function* handleUpdateDerivationPath(action) {
  eth.disconnect()
  yield put(connectWalletRequest())
}

function* handleTransactionSuccess(action) {
  const { transaction } = action
  switch (transaction.actionType) {
    case BUY_MANA_SUCCESS: {
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
    // ..
  }
  yield null
}

function* handleApproveMortgageForManaRequest(action) {
  try {
    const mana = action.mana
    const manaTokenContract = eth.getContract('MANAToken')

    const txHash = yield call(() =>
      manaTokenContract.approve(getMortgageHelperAddress(), mana)
    )

    yield put(approveMortgageForManaSuccess(txHash, mana))
  } catch (error) {
    yield put(approveMortgageForManaFailure(error.message))
  }
}

function* handleApproveMortgageForRCNRequest(action) {
  try {
    const rcn = action.rcn
    const rcnTokenContract = eth.getContract('RCNToken')

    const txHash = yield call(() =>
      rcnTokenContract.approve(getMortgageManagerAddress(), rcn)
    )

    yield put(approveMortgageForRCNSuccess(txHash, rcn))
  } catch (error) {
    yield put(approveMortgageForRCNFailure(error.message))
  }
}
