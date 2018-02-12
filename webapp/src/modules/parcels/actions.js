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

export function fetchParcelsSuccess(parcels) {
  return {
    type: FETCH_PARCELS_SUCCESS,
    parcels
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

export function editParcelSuccess(parcel) {
  return {
    type: EDIT_PARCEL_SUCCESS,
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

// Fatch Parcel Data

export const FETCH_PARCEL_DATA_REQUEST = '[Request] Fetch Parcel Data'
export const FETCH_PARCEL_DATA_SUCCESS = '[Success] Fetch Parcel Data'
export const FETCH_PARCEL_DATA_FAILURE = '[Failure] Fetch Parcel Data'

export function fetchParcelDataRequest(x, y) {
  return {
    type: FETCH_PARCEL_DATA_REQUEST,
    x,
    y
  }
}

export function fetchParcelDataSuccess(x, y, parcel) {
  return {
    type: FETCH_PARCEL_DATA_SUCCESS,
    x,
    y,
    parcel
  }
}

export function fetchParcelDataFailure(x, y, error) {
  return {
    type: FETCH_PARCEL_DATA_FAILURE,
    x,
    y,
    error
  }
}
