import { txUtils } from 'decentraland-commons'
const { TRANSACTION_STATUS } = txUtils

export const getState = state => state.transaction
export const getData = state => getState(state).data

export const getTransactionsByType = (state, type) =>
  getData(state).filter(item => item.action.type === type)

export const getPendingTransactions = state =>
  getData(state).filter(item => item.status === TRANSACTION_STATUS.pending)
