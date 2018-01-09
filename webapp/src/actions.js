import types from './types'

// -------------------------------------------------------------------------
// Parcels

export function fetchUserParcels() {
  return {
    type: types.fetchUserParcels.request
  }
}

export function editParcel(parcel) {
  return {
    type: types.editParcel.request,
    parcel
  }
}

// -------------------------------------------------------------------------
// Locations

export function navigateTo(url) {
  return {
    type: types.navigateTo,
    url
  }
}
