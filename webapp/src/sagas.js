import { all } from 'redux-saga/effects'

import { createTranslationSaga } from '@dapps/modules/translation/sagas'
import { addressSaga } from 'modules/address/sagas'
import { analyticsSaga } from 'modules/analytics/sagas'
import { districtsSaga } from 'modules/districts/sagas'
import { locationSaga } from 'modules/location/sagas'
import { parcelsSaga } from 'modules/parcels/sagas'
import { publicationSaga } from 'modules/publication/sagas'
import { transactionSaga } from 'modules/transaction/sagas'
import { walletSaga } from 'modules/wallet/sagas'
import { estateSaga } from 'modules/estates/sagas'
import { mortgageSaga } from 'modules/mortgage/sagas'
import { mapSaga } from 'modules/map/sagas'

import { api } from 'lib/api'

const translationSaga = createTranslationSaga({
  getTranslation: locale => api.fetchTranslations(locale)
})

export function* rootSaga() {
  yield all([
    analyticsSaga(),
    addressSaga(),
    districtsSaga(),
    locationSaga(),
    parcelsSaga(),
    publicationSaga(),
    transactionSaga(),
    translationSaga(),
    walletSaga(),
    estateSaga(),
    mortgageSaga(),
    mapSaga()
  ])
}
