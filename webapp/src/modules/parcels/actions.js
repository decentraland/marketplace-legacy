export const FETCH_PARCELS_REQUEST = '[Request] Parcels fetch requested'
export const FETCH_PARCELS_SUCCESS = '[Success] Parcels fetched'
export const FETCH_PARCELS_FAILURE = '[Failure] Failure to fetch wallet'

export function fetchParcels(nw, se) {
  return {
    type: FETCH_PARCELS_REQUEST,
    nw,
    se
  }
}
