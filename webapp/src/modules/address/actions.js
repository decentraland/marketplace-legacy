// Fetch Address

export const FETCH_ADDRESS = 'Fetch Address'

export function fetchAddress(address) {
  return {
    type: FETCH_ADDRESS,
    address
  }
}

// Fetch Address Parcels

export const FETCH_ADDRESS_PARCELS_REQUEST = '[Request] Fetch Address Parcels'
export const FETCH_ADDRESS_PARCELS_SUCCESS = '[Success] Fetch Address Parcels'
export const FETCH_ADDRESS_PARCELS_FAILURE = '[Failure] Fetch Address Parcels'

export function fetchAddressParcelsRequest(address, status) {
  return {
    type: FETCH_ADDRESS_PARCELS_REQUEST,
    address,
    status
  }
}

export function fetchAddressParcelsSuccess(address, parcels, publications) {
  return {
    type: FETCH_ADDRESS_PARCELS_SUCCESS,
    address,
    parcels,
    publications
  }
}

export function fetchAddressParcelsFailure(address, error) {
  return {
    type: FETCH_ADDRESS_PARCELS_FAILURE,
    address,
    error
  }
}

// Fetch Address Contributions

export const FETCH_ADDRESS_CONTRIBUTIONS_REQUEST =
  '[Request] Fetch Address Contributions'
export const FETCH_ADDRESS_CONTRIBUTIONS_SUCCESS =
  '[Success] Fetch Address Contributions'
export const FETCH_ADDRESS_CONTRIBUTIONS_FAILURE =
  '[Failure] Fetch Address Contributions'

export function fetchAddressContributionsRequest(address) {
  return {
    type: FETCH_ADDRESS_CONTRIBUTIONS_REQUEST,
    address
  }
}

export function fetchAddressContributionsSuccess(address, contributions) {
  return {
    type: FETCH_ADDRESS_CONTRIBUTIONS_SUCCESS,
    address,
    contributions
  }
}

export function fetchAddressContributionsFailure(address, error) {
  return {
    type: FETCH_ADDRESS_CONTRIBUTIONS_FAILURE,
    address,
    error
  }
}

// Fetch Address Publications

export const FETCH_ADDRESS_PUBLICATIONS_REQUEST =
  '[Request] Fetch Address Publications'
export const FETCH_ADDRESS_PUBLICATIONS_SUCCESS =
  '[Success] Fetch Address Publications'
export const FETCH_ADDRESS_PUBLICATIONS_FAILURE =
  '[Failure] Fetch Address Publications'

export function fetchAddressPublicationsRequest(address) {
  return {
    type: FETCH_ADDRESS_PUBLICATIONS_REQUEST,
    address
  }
}

export function fetchAddressPublicationsSuccess(address, assets, publications) {
  return {
    type: FETCH_ADDRESS_PUBLICATIONS_SUCCESS,
    address,
    assets,
    publications
  }
}

export function fetchAddressPublicationsFailure(address, error) {
  return {
    type: FETCH_ADDRESS_PUBLICATIONS_FAILURE,
    address,
    error
  }
}

// Fetch Address Estates

export const FETCH_ADDRESS_ESTATES_REQUEST = '[Request] Fetch Address Estates'
export const FETCH_ADDRESS_ESTATES_SUCCESS = '[Success] Fetch Address Estates'
export const FETCH_ADDRESS_ESTATES_FAILURE = '[Failure] Fetch Address Estates'

export function fetchAddressEstatesRequest(address) {
  return {
    type: FETCH_ADDRESS_ESTATES_REQUEST,
    address
  }
}

export function fetchAddressEstatesSuccess(address, estates, publications) {
  return {
    type: FETCH_ADDRESS_ESTATES_SUCCESS,
    address,
    estates,
    publications
  }
}

export function fetchAddressEstatesFailure(address, error) {
  return {
    type: FETCH_ADDRESS_ESTATES_FAILURE,
    address,
    error
  }
}
