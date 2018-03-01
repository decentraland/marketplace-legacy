import { txUtils } from 'decentraland-commons'
const { TRANSACTION_STATUS } = txUtils

export const getState = state => state.transaction
export const getData = state => getState(state).data

export const getPendingTransactions = state =>
  getTransactionsByStatus(state, TRANSACTION_STATUS.pending)

export const getTransactionHistory = state =>
  getData(state).filter(item => item.status !== TRANSACTION_STATUS.pending)

export const getTransactionsByType = (state, type) =>
  getData(state).filter(item => item.actionType === type)

export const getTransactionsByStatus = (state, status) =>
  getData(state).filter(item => item.status === status)
