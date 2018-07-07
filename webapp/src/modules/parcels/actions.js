import { buildTransactionAction } from 'modules/transaction/utils'

// Edit Parcel

export const EDIT_PARCEL_REQUEST = '[Request] Edit Parcel'
export const EDIT_PARCEL_SUCCESS = '[Success] Edit Parcel'
export const EDIT_PARCEL_FAILURE = '[Failure] Edit Parcel'

export function editParcelRequest(parcel) {
  return {
    type: EDIT_PARCEL_REQUEST,
    parcel
  }
}

export function editParcelSuccess(txHash, parcel) {
  return {
    type: EDIT_PARCEL_SUCCESS,
    ...buildTransactionAction(txHash, {
      x: parcel.x,
      y: parcel.y,
      data: parcel.data
    }),
    parcel
  }
}

export function editParcelFailure(parcel, error) {
  return {
    type: EDIT_PARCEL_FAILURE,
    parcel,
    error
  }
}

// Fetch Parcel

export const FETCH_PARCEL_REQUEST = '[Request] Fetch Parcel'
export const FETCH_PARCEL_SUCCESS = '[Success] Fetch Parcel'
export const FETCH_PARCEL_FAILURE = '[Failure] Fetch Parcel'

export function fetchParcelRequest(x, y) {
  return {
    type: FETCH_PARCEL_REQUEST,
    x,
    y
  }
}

export function fetchParcelSuccess(x, y, parcel) {
  return {
    type: FETCH_PARCEL_SUCCESS,
    x,
    y,
    parcel
  }
}

export function fetchParcelFailure(x, y, error) {
  return {
    type: FETCH_PARCEL_FAILURE,
    x,
    y,
    error
  }
}

// Manage Parcel

export const MANAGE_PARCEL_REQUEST = '[Request] Manage Parcel'
export const MANAGE_PARCEL_SUCCESS = '[Success] Manage Parcel'
export const MANAGE_PARCEL_FAILURE = '[Failure] Manage Parcel'

export function manageParcelRequest(parcel, address, revoked) {
  return {
    type: MANAGE_PARCEL_REQUEST,
    parcel,
    address,
    revoked
  }
}

export function manageParcelSuccess(txHash, parcel, address, revoked) {
  return {
    type: MANAGE_PARCEL_SUCCESS,
    ...buildTransactionAction(txHash, {
      x: parcel.x,
      y: parcel.y,
      address,
      revoked
    }),
    parcel,
    address,
    revoked
  }
}

export function manageParcelFailure(parcel, address, revoked, error) {
  return {
    type: MANAGE_PARCEL_FAILURE,
    parcel,
    address,
    revoked,
    error
  }
}
