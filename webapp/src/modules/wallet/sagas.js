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
  APPROVE_TOKEN_REQUEST,
  AUTHORIZE_TOKEN_REQUEST,
  TRANSFER_MANA_REQUEST,
  BUY_MANA_REQUEST,
  UPDATE_DERIVATION_PATH,
  BUY_MANA_SUCCESS,
  connectWalletRequest,
  connectWalletSuccess,
  connectWalletFailure,
  approveTokenSuccess,
  approveTokenFailure,
  authorizeTokenSuccess,
  authorizeTokenFailure,
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
import { getData } from './selectors'
import { connectEthereumWallet, sendTransaction, fetchBalance } from './utils'
import { isFeatureEnabled } from 'lib/featureUtils'

export function* walletSaga() {
  yield takeEvery(CONNECT_WALLET_REQUEST, handleConnectWalletRequest)
  yield takeLatest(APPROVE_TOKEN_REQUEST, handleApproveTokenRequest)
  yield takeLatest(AUTHORIZE_TOKEN_REQUEST, handleAuthorizeTokenRequest)
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

    let address = yield call(() => eth.getAddress())
    address = address.toLowerCase()

    const manaTokenContract = eth.getContract('MANAToken')
    const landRegistryContract = eth.getContract('LANDRegistry')
    const legacyMarketplaceContract = eth.getContract('LegacyMarketplace')
    const marketplaceContract = eth.getContract('Marketplace')

    const [
      network,
      balance,
      ethBalance,

      legacyManaAllowance,
      manaAllowance,

      legacyIsLandAuthorized,
      isLandAuthorized
    ] = yield all([
      eth.getNetwork(),
      manaTokenContract.balanceOf(address),
      fetchBalance(address),

      manaTokenContract.allowance(address, legacyMarketplaceContract.address),
      manaTokenContract.allowance(address, marketplaceContract.address),

      landRegistryContract.isApprovedForAll(
        address,
        legacyMarketplaceContract.address
      ),
      landRegistryContract.isApprovedForAll(
        address,
        marketplaceContract.address
      )
    ])

    const wallet = {
      network: network.name,
      type: eth.wallet.type,
      derivationPath: eth.wallet.derivationPath,
      address,
      balance,
      ethBalance,
      allowances: {
        MANAToken: {
          [legacyMarketplaceContract.getContractName()]: legacyManaAllowance,
          [marketplaceContract.getContractName()]: manaAllowance
        },
        RCNToken: {}
      },
      authorizations: {
        LANDRegistry: {
          [legacyMarketplaceContract.getContractName()]: legacyIsLandAuthorized,
          [marketplaceContract.getContractName()]: isLandAuthorized
        }
      }
    }

    console.log(wallet)

    // This condition should be deleted and the `allowance`s used when building the wallet once mortgages go live
    if (isFeatureEnabled('MORTGAGES')) {
      const mortgageAllowances = yield call(getMortgageAllowances, address)
      Object.assign(wallet.allowances.MANAToken, mortgageAllowances.MANAToken)
      Object.assign(wallet.allowances.RCNToken, mortgageAllowances.RCNToken)
    }

    yield handleConnectWalletSuccess(address)
    yield put(connectWalletSuccess(wallet))
  } catch (error) {
    yield put(connectWalletFailure(error.message))
  }
}

function* getMortgageAllowances(address) {
  const mortgageHelperContract = eth.getContract('MortgageHelper')
  const mortgageManagerContract = eth.getContract('MortgageManager')
  const rcnTokenContract = eth.getContract('RCNToken')
  const manaTokenContract = eth.getContract('MANAToken')

  const [mortgageManaAllowance, mortgageRCNAllowance] = yield all([
    manaTokenContract.allowance(address, mortgageHelperContract.address),
    rcnTokenContract.allowance(address, mortgageManagerContract.address)
  ])

  return {
    MANAToken: {
      [mortgageHelperContract.getContractName()]: mortgageManaAllowance
    },
    RCNToken: {
      [mortgageManagerContract.getContractName()]: mortgageRCNAllowance.toNumber() // mortgageRCNAllowance is a BigNumber
    }
  }
}

function* handleConnectWalletSuccess(address) {
  yield put(fetchAddress(address))
}

function* handleApproveTokenRequest(action) {
  try {
    const { amount, contractName, tokenContractName = 'MANAToken' } = action

    const contractToApprove = eth.getContract(contractName)
    const tokenContract = eth.getContract(tokenContractName)

    const txHash = yield call(() =>
      tokenContract.approve(contractToApprove.address, amount)
    )

    yield put(
      approveTokenSuccess(txHash, amount, contractName, tokenContractName)
    )
  } catch (error) {
    yield put(approveTokenFailure(error.message))
  }
}

function* handleAuthorizeTokenRequest(action) {
  try {
    const {
      isAuthorized,
      contractName,
      tokenContractName = 'LANDRegistry'
    } = action

    const contractToApprove = eth.getContract(contractName)
    const tokenContract = eth.getContract(tokenContractName)

    const txHash = yield call(() =>
      tokenContract.setApprovalForAll(contractToApprove.address, isAuthorized)
    )

    yield put(
      authorizeTokenSuccess(
        txHash,
        isAuthorized,
        contractName,
        tokenContractName
      )
    )
  } catch (error) {
    yield put(authorizeTokenFailure(error.message))
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
