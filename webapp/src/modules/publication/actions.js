import { buildTransactionAction } from 'modules/transaction/utils'

// Fetch Publications

export const FETCH_PUBLICATIONS_REQUEST = '[Request] Fetch Publications'
export const FETCH_PUBLICATIONS_SUCCESS = '[Success] Fetch Publications'
export const FETCH_PUBLICATIONS_FAILURE = '[Failure] Fetch Publications'

export function fetchPublicationsRequest({
  limit,
  offset,
  sortBy,
  sortOrder,
  status
} = {}) {
  return {
    type: FETCH_PUBLICATIONS_REQUEST,
    limit,
    offset,
    sortBy,
    sortOrder,
    status
  }
}

export function fetchPublicationsSuccess(parcels, publications, total) {
  return {
    type: FETCH_PUBLICATIONS_SUCCESS,
    parcels,
    publications,
    total
  }
}

export function fetchPublicationsFailure(error) {
  return {
    type: FETCH_PUBLICATIONS_FAILURE,
    error
  }
}

// Fetch Parcel Publications

export const FETCH_PARCEL_PUBLICATIONS_REQUEST =
  '[Request] Fetch Parcel Publications'
export const FETCH_PARCEL_PUBLICATIONS_SUCCESS =
  '[Success] Fetch Parcel Publications'
export const FETCH_PARCEL_PUBLICATIONS_FAILURE =
  '[Failure] Fetch Parcel Publications'

export function fetchParcelPublicationsRequest(x, y) {
  return {
    type: FETCH_PARCEL_PUBLICATIONS_REQUEST,
    x,
    y
  }
}

export function fetchParcelPublicationsSuccess(publications, x, y) {
  return {
    type: FETCH_PARCEL_PUBLICATIONS_SUCCESS,
    publications,
    x,
    y
  }
}

export function fetchParcelPublicationsFailure(error) {
  return {
    type: FETCH_PARCEL_PUBLICATIONS_FAILURE,
    error
  }
}

// Fetch Dashboard Publications

export const FETCH_DASHBOARD_PUBLICATIONS_REQUEST =
  '[Request] Fetch Dashboard Publications'
export const FETCH_DASHBOARD_PUBLICATIONS_SUCCESS =
  '[Success] Fetch Dashboard Publications'
export const FETCH_DASHBOARD_PUBLICATIONS_FAILURE =
  '[Failure] Fetch Dashboard Publications'

export function fetchDashboardPublicationsRequest({
  limit,
  offset,
  sortBy,
  sortOrder,
  status
}) {
  return {
    type: FETCH_DASHBOARD_PUBLICATIONS_REQUEST,
    limit,
    offset,
    sortBy,
    sortOrder,
    status
  }
}

export function fetchDashboardPublicationsSuccess(
  parcels,
  publications,
  total
) {
  return {
    type: FETCH_DASHBOARD_PUBLICATIONS_SUCCESS,
    parcels,
    publications,
    total
  }
}

export function fetchDashboardPublicationsFailure(error) {
  return {
    type: FETCH_DASHBOARD_PUBLICATIONS_FAILURE,
    error
  }
}

// Publish LAND

export const PUBLISH_REQUEST = '[Request] Publish LAND'
export const PUBLISH_SUCCESS = '[Success] Publish LAND'
export const PUBLISH_FAILURE = '[Failure] Publish LAND'

export function publishRequest(publication = {}) {
  return {
    type: PUBLISH_REQUEST,
    publication
  }
}

export function publishSuccess(txHash, publication) {
  return {
    type: PUBLISH_SUCCESS,
    ...buildTransactionAction(txHash, {
      tx_hash: publication.tx_hash,
      x: publication.x,
      y: publication.y
    }),
    publication
  }
}

export function publishFailure(error) {
  return {
    type: PUBLISH_FAILURE,
    error
  }
}

// Buy LAND

export const BUY_REQUEST = '[Request] Buy LAND'
export const BUY_SUCCESS = '[Success] Buy LAND'
export const BUY_FAILURE = '[Failure] Buy LAND'

export function buyRequest(publication = {}) {
  return {
    type: BUY_REQUEST,
    publication
  }
}

export function buySuccess(txHash, publication) {
  return {
    type: BUY_SUCCESS,
    ...buildTransactionAction(txHash, {
      tx_hash: publication.tx_hash,
      x: publication.x,
      y: publication.y,
      price: publication.price
    }),
    publication
  }
}

export function buyFailure(error) {
  return {
    type: BUY_FAILURE,
    error
  }
}

// Cancel LAND Sale

export const CANCEL_SALE_REQUEST = '[Request] Cancel LAND Sale'
export const CANCEL_SALE_SUCCESS = '[Success] Cancel LAND Sale'
export const CANCEL_SALE_FAILURE = '[Failure] Cancel LAND Sale'

export function cancelSaleRequest(publication = {}) {
  return {
    type: CANCEL_SALE_REQUEST,
    publication
  }
}

export function cancelSaleSuccess(txHash, publication) {
  return {
    type: CANCEL_SALE_SUCCESS,
    ...buildTransactionAction(txHash, {
      tx_hash: publication.tx_hash,
      x: publication.x,
      y: publication.y
    }),
    publication
  }
}

export function cancelSaleFailure(error) {
  return {
    type: CANCEL_SALE_FAILURE,
    error
  }
}
