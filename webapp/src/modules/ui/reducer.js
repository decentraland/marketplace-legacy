import { combineReducers } from 'redux'

import { loadingReducer as loading } from './loading/reducer'
import { mapReducer as map } from './map/reducer'
import { modalReducer as modal } from './modal/reducer'
import { sidebarReducer as sidebar } from './sidebar/reducer'
import { toastReducer as toast } from './toast/reducer'

export * from './loading/reducer'
export * from './map/reducer'
export * from './modal/reducer'
export * from './toast/reducer'
export * from './sidebar/reducer'

export const uiReducer = combineReducers({
  loading,
  map,
  modal,
  toast,
  sidebar
})
