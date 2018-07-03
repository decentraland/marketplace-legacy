import { txUtils } from 'decentraland-eth'

const { TRANSACTION_STATUS } = txUtils

export const getState = state => state.transaction
export const getData = state => getState(state).data
export const getLoading = state => getState(state).loading

export const getPendingTransactions = (state, address) =>
  getTransactionsByStatus(state, address, TRANSACTION_STATUS.pending)

export const getTransactionHistory = (state, address) =>
  getData(state).filter(
    item => item.from === address && item.status !== TRANSACTION_STATUS.pending
  )

export const getTransactionsByType = (state, address, type) =>
  getData(state).filter(
    item => item.from === address && item.actionType === type
  )

export const getTransactionsByStatus = (state, address, status) =>
  getData(state).filter(item => item.from === address && item.status === status)
