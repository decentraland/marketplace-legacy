import { all } from 'redux-saga/effects'

import { addressSaga } from 'modules/address/sagas'
import { districtsSaga } from 'modules/districts/sagas'
import { locationSaga } from 'modules/location/sagas'
import { parcelsSaga } from 'modules/parcels/sagas'
import { transactionSaga } from 'modules/transaction/sagas'
import { transferSaga } from 'modules/transfer/sagas'
import { uiSaga } from 'modules/ui/sagas'
import { walletSaga } from 'modules/wallet/sagas'

export function* rootSaga() {
  yield all([
    addressSaga(),
    districtsSaga(),
    locationSaga(),
    parcelsSaga(),
    transactionSaga(),
    transferSaga(),
    uiSaga(),
    walletSaga()
  ])
}
