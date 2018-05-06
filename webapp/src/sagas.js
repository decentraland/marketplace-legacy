import { all } from 'redux-saga/effects'

import { addressSaga } from 'modules/address/sagas'
import { analyticsSaga } from 'modules/analytics/sagas'
import { dashboardSaga } from 'modules/dashboard/sagas'
import { districtsSaga } from 'modules/districts/sagas'
import { locationSaga } from 'modules/location/sagas'
import { parcelsSaga } from 'modules/parcels/sagas'
import { publicationSaga } from 'modules/publication/sagas'
import { transactionSaga } from 'modules/transaction/sagas'
import { transferSaga } from 'modules/transfer/sagas'
import { translationSaga } from 'modules/translation/sagas'
import { uiSaga } from 'modules/ui/sagas'
import { walletSaga } from 'modules/wallet/sagas'

export function* rootSaga() {
  yield all([
    analyticsSaga(),
    dashboardSaga(),
    addressSaga(),
    districtsSaga(),
    locationSaga(),
    parcelsSaga(),
    publicationSaga(),
    transactionSaga(),
    transferSaga(),
    translationSaga(),
    uiSaga(),
    walletSaga()
  ])
}
