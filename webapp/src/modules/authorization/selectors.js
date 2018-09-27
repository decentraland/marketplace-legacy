import { ALLOW_TOKEN_SUCCESS, APPROVE_TOKEN_SUCCESS } from './actions'
import { getTransactionsByType } from '@dapps/modules/transaction/selectors'
import { getAddress } from 'modules/wallet/selectors'

export const getState = state => state.authorization
export const getData = state => getState(state).data
export const getLoading = state => getState(state).loading
export const isLoading = state => getLoading(state).length > 0
export const getError = state => getState(state).error

export const getAllowTransactions = state =>
  getTransactionsByType(state, getAddress(state), ALLOW_TOKEN_SUCCESS)
export const getApproveTransactions = state =>
  getTransactionsByType(state, getAddress(state), APPROVE_TOKEN_SUCCESS)
