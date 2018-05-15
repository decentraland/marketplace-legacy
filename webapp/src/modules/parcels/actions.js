import { buildTransactionAction } from 'modules/transaction/utils'

// Fetch Parcels

export const FETCH_PARCELS_REQUEST = '[Request] Fetch Parcels'
export const FETCH_PARCELS_SUCCESS = '[Success] Fetch Parcels'
export const FETCH_PARCELS_FAILURE = '[Failure] Fetch Parcels'

export function fetchParcelsRequest(nw, se) {
  return {
    type: FETCH_PARCELS_REQUEST,
    nw,
    se
  }
}

export function fetchParcelsSuccess(parcels, publications) {
  return {
    type: FETCH_PARCELS_SUCCESS,
    parcels,
    publications
  }
}

export function fetchParcelsFailure(error) {
  return {
    type: FETCH_PARCELS_FAILURE,
    error
  }
}

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

export function manageParcelRequest(parcel, address) {
  return {
    type: MANAGE_PARCEL_REQUEST,
    parcel,
    address
  }
}

export function manageParcelSuccess(txHash, parcel, address) {
  return {
    type: MANAGE_PARCEL_SUCCESS,
    ...buildTransactionAction(txHash, {
      x: parcel.x,
      y: parcel.y,
      address
    }),
    parcel,
    address
  }
}

export function manageParcelFailure(parcel, address, error) {
  return {
    type: MANAGE_PARCEL_FAILURE,
    parcel,
    error
  }
}
