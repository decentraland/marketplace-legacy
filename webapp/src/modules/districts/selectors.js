export const getState = state => state.districts
export const getDistricts = state => getState(state).data
export const isLoading = state => getState(state).loading
export const getError = state => getState(state).error
