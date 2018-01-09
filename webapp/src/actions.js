import types from './types'

// -------------------------------------------------------------------------
// Web3

export function connectWeb3(address) {
  return {
    type: types.connectWeb3.request,
    address
  }
}

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
