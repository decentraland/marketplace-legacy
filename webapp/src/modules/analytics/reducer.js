import { STORAGE_SAVE } from 'modules/storage/actions'

export function analyticsReduceer(state, action) {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
    case STORAGE_SAVE:
      return null
    // Customize how certain actions report to analytics here
    default:
      return action
  }
}
