import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import ui from 'modules/ui/reducer'
import wallet from 'modules/wallet/reducer'
import districts from 'modules/districts/reducer'

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
  ui,
  wallet,
  districts,
  router,
  analytics
})
