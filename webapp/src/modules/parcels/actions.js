export const FETCH_PARCELS_REQUEST = '[Request] Parcels fetch requested'
export const FETCH_PARCELS_SUCCESS = '[Success] Parcels fetched'
export const FETCH_PARCELS_FAILURE = '[Failure] Failure to fetch parcel'

export const EDIT_PARCEL_REQUEST = '[Request] Edit Parcel requested'
export const EDIT_PARCEL_SUCCESS = '[Success] Parcel edited'
export const EDIT_PARCEL_FAILURE = '[Failure] Failure to edit parcel'

export const MERGE_PARCELS = 'Merge Parcels'

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

export function mergeParcels(parcels) {
  return {
    type: MERGE_PARCELS,
    parcels
  }
}

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
    type: EDIT_PARCEL_SUCCESS,
    parcel,
    error
  }
}
