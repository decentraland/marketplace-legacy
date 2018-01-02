import { all, call, takeLatest, takeEvery, put } from 'redux-saga/effects'
import { push, replace } from 'react-router-redux'

import { utils } from 'decentraland-commons'
import { eth as web3Eth } from 'decentraland-commons'

import { isChrome } from './lib/browser'
import locations from './locations'
import types from './types'
// import { selectors } from './reducers'

// import api from './lib/api'

function* rootSaga() {
  yield takeLatest(types.connectWeb3.request, connectWeb3)
  yield takeEvery(types.navigateTo, handleLocationChange)
}

// -------------------------------------------------------------------------
// Web3

async function connectLedger(action = {}, retries = 0) {
  try {
    if (!isChrome()) {
      // Ledger only works on chrome apparently
      return false
    }

    const ledger = window.ledger
    const comm = await ledger.comm_u2f.create_async(2)
    const ledgerEth = new ledger.eth(comm)
    const address = await ledgerEth.getAddress_async(`44'/60'/0'/0`)

    return {
      ethereum: ledgerEth,
      ledger: true,
      address: address.address.toLowerCase()
    }
  } catch (error) {
    let result = false

    if (retries < 3) {
      await utils.sleep(1000)
      result = connectLedger(action, retries + 1)
    }

    return result
  }
}

async function connectBrowser(action = {}) {
  try {
    let retries = 0
    let connected = await web3Eth.reconnect(action.address)

    while (!connected && retries <= 3) {
      await utils.sleep(1500)
      connected = await web3Eth.connect(action.address)
      retries += 1
    }

    if (!connected) return false
    const address = await web3Eth.getAddress()

    return {
      ethereum: web3Eth,
      address: address.toLowerCase()
    }
  } catch (error) {
    return false
  }
}

function* connectWeb3(action = {}) {
  try {
    const { ledger, browser } = yield all({
      ledger: call(connectLedger),
      browser: call(connectBrowser)
    })

    if (!ledger && !browser) throw new Error('Could not connect to web3')

    const address = ledger ? ledger.address : browser.address
    const ethereum = ledger ? ledger.ethereum : browser.ethereum

    yield put({
      type: types.connectWeb3.success,
      ledger: !!ledger,
      ethereum,
      web3Connected: true,
      address: address
    })
  } catch (error) {
    yield put(replace(locations.walletError))
    yield put({ type: types.connectWeb3.failed, message: error.message })
  }
}

// -------------------------------------------------------------------------
// Location

function* handleLocationChange(action) {
  yield put(push(action.url))
}

export default rootSaga
