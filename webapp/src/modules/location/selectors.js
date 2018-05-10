import { STATIC_PAGES } from 'locations'

export const getLocation = state => hasRouter(state) && state.router.location
export const getPathname = state =>
  hasRouter(state) && getLocation(state).pathname
export const getPathAction = state =>
  hasRouter(state) &&
  getPathname(state)
    .split('/')
    .pop()

export const hasRouter = state => !!state.router
export const isStaticPage = state => STATIC_PAGES.includes(getPathname(state))
export const isModalPage = state => {
  const lastPartOfUrl = getPathAction(state)
  switch (lastPartOfUrl) {
    case 'edit':
    case 'buy':
    case 'sell':
    case 'cancel-sale':
    case 'transfer':
    case 'settings':
    case 'transfer-mana':
    case 'buy-mana':
      return true
    default:
      return false
  }
}

// leverages state injected by react-routers withRouter
export const getMatch = state => state.match
export const getMatchParams = state => getMatch(state).params
export const getMatchParamsCoordinates = state => {
  const params = getMatchParams(state)
  return {
    x: parseInt(params.x, 10),
    y: parseInt(params.y, 10)
  }
}
