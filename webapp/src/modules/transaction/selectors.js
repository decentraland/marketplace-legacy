export const getState = state => state.transaction
export const getData = state => getState(state).data

export const getTransactionsByType = (state, type) =>
  getData(state).filter(item => item.action.type === type)
