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
// Loading

export function setLoading(loading = false) {
  return {
    type: types.setLoading,
    loading
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

export function parcelRangeChange(minX, minY, maxX, maxY) {
  return {
    type: types.parcelRangeChanged,
    minX,
    minY,
    maxX,
    maxY
  }
}

export function clickParcel(x, y) {
  return {
    type: types.clickParcel,
    x,
    y
  }
}

// -------------------------------------------------------------------------
// Modal

export function openModal(name, data) {
  return {
    type: types.modal.open,
    name,
    data
  }
}

export function closeModal() {
  return {
    type: types.modal.close
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

// -------------------------------------------------------------------------
// Sidebar

export function openSidebar() {
  return {
    type: types.sidebar.open
  }
}

export function closeSidebar() {
  return {
    type: types.sidebar.close
  }
}
