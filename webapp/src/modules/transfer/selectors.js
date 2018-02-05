export const getState = state => state.transfer
export const getTransfer = state => getState(state).data
export const isLoading = state => getState(state).loading
export const getError = state => getState(state).error
