export const FETCH_ADDRESS_PARCELS_REQUEST =
  '[Request] Address parcels fetch requested'

export const FETCH_ADDRESS_PARCELS_SUCCESS =
  '[Success] Address parcels fetched successfully'

export const FETCH_ADDRESS_PARCELS_FAILURE =
  '[Failure] Failure to fetch address parcels'

export function fetchAddressParcels(address) {
  return {
    type: FETCH_ADDRESS_PARCELS_REQUEST,
    address
  }
}
