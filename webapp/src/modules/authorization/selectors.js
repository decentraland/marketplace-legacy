// import { isLoadingType } from '@dapps/modules/loading/selectors'

export const getState = state => state.authorization
export const getData = state => getState(state).data
export const getLoading = state => getState(state).loading
export const getError = state => getState(state).error

// state =>
//   getTransactionsByType(state, getAddress(state), APPROVE_MANA_SUCCESS),
// state =>
//   getTransactionsByType(state, getAddress(state), AUTHORIZE_LAND_SUCCESS),
// state =>
//   getTransactionsByType(
//     state,
//     getAddress(state),
//     APPROVE_MORTGAGE_FOR_MANA_SUCCESS
//   ),
// state =>
//   getTransactionsByType(
//     state,
//     getAddress(state),
//     APPROVE_MORTGAGE_FOR_RCN_SUCCESS
//   )
