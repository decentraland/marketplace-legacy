import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'

import { addressReducer as address } from 'modules/address/reducer'
import { dashboardReducer as dashboard } from 'modules/dashboard/reducer'
import { districtsReducer as districts } from 'modules/districts/reducer'
import { parcelsReducer as parcels } from 'modules/parcels/reducer'
import { publicationReducer as publication } from 'modules/publication/reducer'
import { transactionReducer as transaction } from 'modules/transaction/reducer'
import { transferReducer as transfer } from 'modules/transfer/reducer'
import { translationReducer as translation } from 'modules/translation/reducer'
import { uiReducer as ui } from 'modules/ui/reducer'
import { walletReducer as wallet } from 'modules/wallet/reducer'
import {
  storageReducer as storage,
  storageReducerWrapper
} from 'modules/storage/reducer'

export const rootReducer = storageReducerWrapper(
  combineReducers({
    address,
    dashboard,
    districts,
    parcels,
    publication,
    transaction,
    transfer,
    translation,
    ui,
    wallet,
    router,
    storage
  })
)
