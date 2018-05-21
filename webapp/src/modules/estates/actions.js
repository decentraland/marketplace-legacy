import { buildTransactionAction } from 'modules/transaction/utils'

// Create Estate

export const CREATE_ESTATE_REQUEST = '[Request] Create Estate'
export const CREATE_ESTATE_SUCCESS = '[Success] Create Estate'
export const CREATE_ESTATE_FAILURE = '[Failure] Create Estate'

export function createEstateRequest(estate) {
  return {
    type: CREATE_ESTATE_REQUEST,
    estate
  }
}

export function createEstateSuccess(txHash, estate) {
  return {
    type: CREATE_ESTATE_SUCCESS,
    ...buildTransactionAction(txHash, {
      tx_hash: estate.tx_hash,
      parcels: estate.parcels
    }),
    estate
  }
}

export function createEstateFailure(error) {
  return {
    type: CREATE_ESTATE_FAILURE,
    error
  }
}
