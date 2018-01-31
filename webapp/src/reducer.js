import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'

import { addressReducer as address } from 'modules/address/reducer'
import { districtsReducer as districts } from 'modules/districts/reducer'
import { parcelsReducer as parcels } from 'modules/parcels/reducer'
import { transferReducer as transfer } from 'modules/transfer/reducer'
import { uiReducer as ui } from 'modules/ui/reducer'
import { walletReducer as wallet } from 'modules/wallet/reducer'

export function analytics(state, action) {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      return null
    // Customize how certain actions report to analytics here
    default:
      return action
  }
}

//---------
export const rootReducer = combineReducers({
  address,
  districts,
  parcels,
  transfer,
  ui,
  wallet,
  router,
  analytics
})
