import { TRANSFER_PARCEL_REQUEST } from './actions'

export const getState = state => state.transfer
export const getTransfer = state => getState(state).data
export const isLoading = state => getState(state).loading.length > 0
export const getLoading = state => getState(state).loading
export const getError = state => getState(state).error

export const isTxIdle = state =>
  getLoading(state).some(action => action.type === TRANSFER_PARCEL_REQUEST)
