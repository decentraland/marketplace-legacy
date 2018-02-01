export const FETCH_PARCELS_REQUEST = '[Request] Parcels fetch requested'
export const FETCH_PARCELS_SUCCESS = '[Success] Parcels fetched'
export const FETCH_PARCELS_FAILURE = '[Failure] Failure to fetch parcels'

export const FETCH_PARCEL_REQUEST = '[Request] Parcel fetch requested'
export const FETCH_PARCEL_SUCCESS = '[Success] Parcel fetched'
export const FETCH_PARCEL_FAILURE = '[Failure] Failure to fetch parcel'

export const FETCH_PARCEL_DATA_REQUEST = '[Request] Parcel data fetch requested'
export const FETCH_PARCEL_DATA_SUCCESS = '[Success] Parcel data fetched'
export const FETCH_PARCEL_DATA_FAILURE = '[Failure] Failure to fetch data'

export const EDIT_PARCEL_REQUEST = '[Request] Edit Parcel requested'
export const EDIT_PARCEL_SUCCESS = '[Success] Parcel edited'
export const EDIT_PARCEL_FAILURE = '[Failure] Failure to edit parcel'

export const MERGE_PARCELS = 'Merge Parcels'

export function fetchParcels(nw, se) {
  return {
    type: FETCH_PARCELS_REQUEST,
    nw,
    se
  }
}

export function fetchParcel(x, y) {
  return {
    type: FETCH_PARCEL_REQUEST,
    x,
    y
  }
}

export function fetchParcelData(parcel) {
  return {
    type: FETCH_PARCEL_DATA_REQUEST,
    parcel
  }
}

export function editParcel(parcel) {
  return {
    type: EDIT_PARCEL_REQUEST,
    parcel
  }
}
