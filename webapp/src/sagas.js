import { all } from 'redux-saga/effects'
import { createTranslationSaga } from '@dapps/modules/translation/sagas'
import { addressSaga } from 'modules/address/sagas'
import { analyticsSaga } from '@dapps/modules/analytics/sagas'
import { transactionSaga } from '@dapps/modules/transaction/sagas'
import { locationSaga } from '@dapps/modules/location/sagas'

import { assetSaga } from 'modules/asset/sagas'
import { auctionSaga } from 'modules/auction/sagas'
import { authorizationSaga } from 'modules/authorization/sagas'
import { districtsSaga } from 'modules/districts/sagas'
import { parcelsSaga } from 'modules/parcels/sagas'
import { publicationSaga } from 'modules/publication/sagas'
import { walletSaga } from 'modules/wallet/sagas'
import { estateSaga } from 'modules/estates/sagas'
import { mortgageSaga } from 'modules/mortgage/sagas'
import { tileSaga } from 'modules/tile/sagas'
import { managementSaga } from 'modules/management/sagas'
import { bidSagas } from 'modules/bid/sagas'

import { api } from 'lib/api'

const localTranslations = {
  en: {
    warning:
      'Due to an error in our indexer the new marketplace is under mantainance'
  },
  es: {
    warning:
      'Due to an error in our indexer the new marketplace is under mantainance'
  },
  fr: {
    warning:
      'Due to an error in our indexer the new marketplace is under mantainance'
  },
  ja: {
    warning:
      'Due to an error in our indexer the new marketplace is under mantainance'
  },
  zh: {
    warning:
      'Due to an error in our indexer the new marketplace is under mantainance'
  },
  ko: {
    warning:
      'Due to an error in our indexer the new marketplace is under mantainance'
  }
}

const translationSaga = createTranslationSaga({
  getTranslation: locale =>
    api.fetchTranslations(locale).then(translations => ({
      ...translations,
      ...localTranslations[locale]
    }))
})

export function* rootSaga() {
  yield all([
    addressSaga(),
    analyticsSaga(),
    assetSaga(),
    auctionSaga(),
    authorizationSaga(),
    districtsSaga(),
    locationSaga(),
    parcelsSaga(),
    publicationSaga(),
    bidSagas(),
    transactionSaga(),
    translationSaga(),
    walletSaga(),
    estateSaga(),
    mortgageSaga(),
    tileSaga(),
    managementSaga()
  ])
}
