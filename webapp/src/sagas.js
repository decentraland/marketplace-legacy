import { all } from 'redux-saga/effects'

import walletSaga from 'modules/wallet/sagas'
import districtsSaga from 'modules/districts/sagas'
import uiSaga from 'modules/ui/sagas'
import parcelsSaga from 'modules/parcels/sagas'
import locationSaga from 'modules/location/sagas'

export default function* saga() {
  yield all([
    districtsSaga(),
    walletSaga(),
    uiSaga(),
    parcelsSaga(),
    locationSaga()
  ])
}
