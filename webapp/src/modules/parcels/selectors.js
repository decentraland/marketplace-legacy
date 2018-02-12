export const getState = state => state.parcels
export const getParcels = state => getState(state).data
export const isLoading = state => getState(state).loading.length > 0
export const getError = state => getState(state).error
