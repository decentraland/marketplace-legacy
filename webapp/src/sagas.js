import { takeEvery, put, all } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import types from './types'

import walletSaga from 'modules/wallet/sagas'
import districtsSaga from 'modules/districts/sagas'

function* rootSaga() {
  yield all([districtsSaga(), walletSaga()])

  yield takeEvery(types.navigateTo, handleLocationChange)
}

// -------------------------------------------------------------------------
// Location

function* handleLocationChange(action) {
  yield put(push(action.url))
}

export default rootSaga
