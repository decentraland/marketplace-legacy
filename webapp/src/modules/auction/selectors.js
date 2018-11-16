export const getState = state => state.auction
export const getData = state => getState(state).data
export const getLoading = state => getState(state).loading
export const isLoading = state => getLoading(state).length > 0
export const getError = state => getState(state).error
export const getParams = state => getData(state).params
export const getCenter = state => getData(state).center
export const getParcelOnChainOwners = state =>
  getData(state).parcelOnChainOwners
