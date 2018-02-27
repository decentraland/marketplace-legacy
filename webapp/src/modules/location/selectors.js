export const getLocation = state => state.router.location
// leverages state injected by react-routers withRouter
export const getState = state => state.match
export const getParams = state => getState(state).params
