export const FETCH_ADDRESS_PARCELS_REQUEST =
  '[Request] Address parcels fetch requested'

export const FETCH_ADDRESS_PARCELS_SUCCESS =
  '[Success] Address parcels fetched successfully'

export const FETCH_ADDRESS_PARCELS_FAILURE =
  '[Failure] Failure to fetch address parcels'

export const FETCH_ADDRESS_CONTRIBUTIONS_REQUEST =
  '[Request] Address contributions fetch requested'

export const FETCH_ADDRESS_CONTRIBUTIONS_SUCCESS =
  '[Success] Address contributions fetched successfully'

export const FETCH_ADDRESS_CONTRIBUTIONS_FAILURE =
  '[Failure] Failure to fetch address contributions'

export function fetchAddressParcelsRequest(address) {
  return {
    type: FETCH_ADDRESS_PARCELS_REQUEST,
    address
  }
}

export function fetchAddressParcelsSuccess(address, parcels) {
  return {
    type: FETCH_ADDRESS_PARCELS_SUCCESS,
    address,
    parcels
  }
}

export function fetchAddressParcelsFailure(address, error) {
  return {
    type: FETCH_ADDRESS_PARCELS_FAILURE,
    address,
    error
  }
}

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
