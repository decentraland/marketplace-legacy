import {
  all,
  call,
  takeLatest,
  takeEvery,
  select,
  put
} from 'redux-saga/effects'
import { push, replace } from 'react-router-redux'

import { utils } from 'decentraland-commons'
import { eth } from 'decentraland-commons'

import { isChrome } from './lib/browser'
import { selectors } from './reducers'
import locations from './locations'
import types from './types'

import api from './lib/api'

function* rootSaga() {
  yield takeLatest(types.connectWeb3.request, connectWeb3)
  yield takeLatest(types.connectWeb3.success, handleFetchUserParcels)

  yield takeLatest(types.editParcel.request, handleEditParcel)
  yield takeLatest(types.editParcel.success, handleFetchUserParcels)

  yield takeEvery(types.navigateTo, handleLocationChange)
}

// -------------------------------------------------------------------------
// Web3

async function connectLedger(action = {}, retries = 0) {
  try {
    if (!isChrome()) {
      // Ledger only works on Chrome apparently
      return false
    }

    const ledger = window.ledger
    const comm = await ledger.comm_u2f.create_async(2)
    const ledgerEth = new ledger.eth(comm)
    const { address } = await ledgerEth.getAddress_async(`44'/60'/0'/0`)

    return {
      ethereum: ledgerEth,
      ledger: true,
      address: address.toLowerCase()
    }
  } catch (error) {
    if (retries > 3) return false

    await utils.sleep(1000)
    return connectLedger(action, retries + 1)
  }
}

async function connectBrowser(action = {}) {
  try {
    let retries = 0
    let connected = await eth.reconnect(action.address)

    while (!connected && retries <= 3) {
      await utils.sleep(1500)
      connected = await eth.connect(action.address)
      retries += 1
    }

    if (!connected) return false
    const address = await eth.getAddress()

    return {
      ethereum: eth,
      address: address.toLowerCase()
    }
  } catch (error) {
    return false
  }
}

// TODO: The web3 connection was correctly encapsulated in `eth.connect`, imported from `decentraland-commons`
// We later introduced ledger support but only on the sagas, without moving the behaviour to commons.
// We shouldn't leak how the connection works and ideally it should be the same interface for the ledger and web3 objects.
function* connectWeb3(action = {}) {
  try {
    const { ledger, browser } = yield all({
      ledger: call(connectLedger),
      browser: call(connectBrowser)
    })

    if (!ledger && !browser) throw new Error('Could not connect to web3')

    const { address, ethereum } = ledger ? ledger : browser

    yield put({
      type: types.connectWeb3.success,
      web3Connected: true,
      ledger: !!ledger,
      ethereum: ethereum,
      address: address
    })
  } catch (error) {
    yield put(replace(locations.walletError))
    yield put({ type: types.connectWeb3.failed, message: error.message })
  }
}

// TODO: This is another candidate for `decentraland-commons`, it leverages web3 and ledger message signing
function* sign(payload) {
  const { ethereum, ledger, address } = yield select(
    selectors.getEthereumConnection
  )
  const message = eth.utils.toHex(payload)
  let signature = null

  if (ledger) {
    const result = yield call(() =>
      ethereum.signPersonalMessage_async("44'/60'/0'/0", message.substring(2))
    )

    let v = result['v'] - 27
    v = v.toString(16)
    if (v.length < 2) {
      v = '0' + v
    }
    signature = '0x' + result['r'] + result['s'] + v
  } else {
    signature = yield call(() => ethereum.remoteSign(message, address))
  }

  return { message, signature }
}

// -------------------------------------------------------------------------
// Parcels

function* handleFetchUserParcels(action) {
  try {
    const address = yield select(selectors.getAddress)
    const userParcels = yield call(() => api.fetchUserParcels(address))

    yield put({ type: types.fetchUserParcels.success, userParcels })
  } catch (error) {
    console.warn(error)
    yield put({ type: types.fetchUserParcels.failed, error: error.message })
  }
}

function* handleEditParcel(action) {
  try {
    const parcel = action.parcel
    const payload = `Decentraland Marketplace: Editing parcel (${Date.now()})
x: ${parcel.x}
y: ${parcel.y}
Name: ${parcel.name}
Description: ${parcel.description}
`
    const { message, signature } = yield call(() => sign(payload))

    yield call(() => api.editParcel(message, signature))

    yield put({ type: types.editParcel.success })
  } catch (error) {
    console.warn(error)
    yield put({ type: types.editParcel.failed, error: error.message })
  }
}

// -------------------------------------------------------------------------
// Location

function* handleLocationChange(action) {
  yield put(push(action.url))
}

export default rootSaga
