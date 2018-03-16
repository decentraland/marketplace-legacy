import { STATIC_PAGES } from 'locations'

export const getLocation = state => state.router && state.router.location
// leverages state injected by react-routers withRouter
export const getState = state => state.match
export const getParams = state => getState(state).params

export const isStaticPage = state =>
  STATIC_PAGES.includes(state.router && state.router.location.pathname)
