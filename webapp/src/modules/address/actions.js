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

export function fetchAddressParcels(address) {
  return {
    type: FETCH_ADDRESS_PARCELS_REQUEST,
    address
  }
}

export function fetchAddressContributions(address) {
  return {
    type: FETCH_ADDRESS_CONTRIBUTIONS_FAILURE,
    address
  }
}
