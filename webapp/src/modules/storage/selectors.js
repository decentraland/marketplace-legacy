export const getState = state => state.storage
export const isLoading = state => getState(state).loading >= 2
