import { combineReducers } from 'redux'

import { modalReducer as modal } from './modal/reducer'
import { sidebarReducer as sidebar } from './sidebar/reducer'
import { marketplaceReducer as marketplace } from './marketplace/reducer'

export const uiReducer = combineReducers({
  modal,
  sidebar,
  marketplace
})
