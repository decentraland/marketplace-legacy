import { takeEvery, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import types from './types'

import walletSaga from 'modules/wallet/sagas'

function* rootSaga() {
  yield walletSaga()

  yield takeEvery(types.navigateTo, handleLocationChange)
}

// -------------------------------------------------------------------------
// Location

function* handleLocationChange(action) {
  yield put(push(action.url))
}

export default rootSaga
