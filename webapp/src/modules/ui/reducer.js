import { combineReducers } from 'redux'

import { loadingReducer as loading } from './loading/reducer'
import { modalReducer as modal } from './modal/reducer'
import { sidebarReducer as sidebar } from './sidebar/reducer'
import { toastReducer as toast } from './toast/reducer'
import { marketplaceReducer as marketplace } from './marketplace/reducer'

export const uiReducer = combineReducers({
  loading,
  modal,
  toast,
  sidebar,
  marketplace
})
