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

// Fetch Estate

export const FETCH_ESTATE_REQUEST = '[Request] Fetch Estate'
export const FETCH_ESTATE_SUCCESS = '[Success] Fetch Estate'
export const FETCH_ESTATE_FAILURE = '[Failure] Fetch Estate'

export function fetchEstateRequest(id) {
  return {
    type: FETCH_ESTATE_REQUEST,
    id
  }
}

export function fetchEstateSuccess(id, estate) {
  return {
    type: FETCH_ESTATE_SUCCESS,
    id,
    estate
  }
}

export function fetchEstateFailure(id, error) {
  return {
    type: FETCH_ESTATE_FAILURE,
    id,
    error
  }
}
