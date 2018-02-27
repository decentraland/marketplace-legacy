import { EDIT_PARCEL_REQUEST } from './actions'

export const getState = state => state.parcels
export const getParcels = state => getState(state).data
export const isLoading = state => getState(state).loading.length > 0
export const getLoading = state => getState(state).loading
export const getError = state => getState(state).error

export const isEditTransactionIdle = state =>
  getLoading(state).some(action => action.type === EDIT_PARCEL_REQUEST)
