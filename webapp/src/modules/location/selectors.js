import { STATIC_PAGES } from 'locations'

export const getLocation = state => state.router && state.router.location
// leverages state injected by react-routers withRouter
export const getState = state => state.match
export const getParams = state => getState(state).params

export const isStaticPage = state =>
  STATIC_PAGES.includes(state.router && state.router.location.pathname)

export const isModalPage = state => {
  if (state.router && state.router.location.pathname) {
    const lastPartOfUrl = state.router.location.pathname.split('/').pop()
    switch (lastPartOfUrl) {
      case 'edit':
      case 'buy':
      case 'sell':
      case 'cancel-sale':
      case 'transfer':
      case 'settings':
        return true
      default:
        return false
    }
  }
  return false
}
