import { takeEvery, put, all } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import types from './types'

import addressSaga from 'modules/address/sagas'
import districtsSaga from 'modules/districts/sagas'
import parcelsSaga from 'modules/parcels/sagas'
import uiSaga from 'modules/ui/sagas'
import walletSaga from 'modules/wallet/sagas'

function* rootSaga() {
  yield all([
    addressSaga(),
    districtsSaga(),
    parcelsSaga(),
    uiSaga(),
    walletSaga()
  ])

  yield takeEvery(types.navigateTo, handleLocationChange)
}

// -------------------------------------------------------------------------
// Location

function* handleLocationChange(action) {
  yield put(push(action.url))
}

export default rootSaga
