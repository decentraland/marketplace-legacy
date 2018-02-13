export const isLoading = state => state.length > 0
export const isLoadingType = (state, type) =>
  state.some(action => action.type === type)
