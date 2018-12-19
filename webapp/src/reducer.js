import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import {
  storageReducer as storage,
  storageReducerWrapper
} from '@dapps/modules/storage/reducer'
import { transactionReducer as transaction } from '@dapps/modules/transaction/reducer'
import { translationReducer as translation } from '@dapps/modules/translation/reducer'

import { addressReducer as address } from 'modules/address/reducer'
import { auctionReducer as auction } from 'modules/auction/reducer'
import { authorizationReducer as authorization } from 'modules/authorization/reducer'
import { districtsReducer as districts } from 'modules/districts/reducer'
import { estatesReducer as estates } from 'modules/estates/reducer'
import { tileReducer as tile } from 'modules/tile/reducer'
import { parcelsReducer as parcels } from 'modules/parcels/reducer'
import { publicationReducer as publication } from 'modules/publication/reducer'
import { uiReducer as ui } from 'modules/ui/reducer'
import { walletReducer as wallet } from 'modules/wallet/reducer'
import mortgage from 'modules/mortgage/reducer'

export const rootReducer = storageReducerWrapper(
  combineReducers({
    address,
    auction,
    authorization,
    districts,
    estates,
    tile,
    mortgage,
    parcels,
    publication,
    transaction,
    translation,
    ui,
    wallet,
    router,
    storage
  })
)
