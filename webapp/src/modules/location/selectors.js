import { STATIC_PAGES } from 'locations'
import { getPathname, getPathAction } from '@dapps/modules/location/selectors'

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
    case 'manage':
    case 'buy-mana':
    case 'edit-metadata':
    case 'delete-estate':
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
