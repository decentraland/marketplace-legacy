import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import address from 'modules/address/reducer'
import districts from 'modules/districts/reducer'
import parcels from 'modules/parcels/reducer'
import ui from 'modules/ui/reducer'
import wallet from 'modules/wallet/reducer'

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
export default combineReducers({
  address,
  districts,
  parcels,
  ui,
  wallet,
  router,
  analytics
})
