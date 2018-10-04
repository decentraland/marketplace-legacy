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
  status,
  tab
} = {}) {
  return {
    type: FETCH_PUBLICATIONS_REQUEST,
    limit,
    offset,
    sortBy,
    sortOrder,
    status,
    tab
  }
}

export function fetchPublicationsSuccess({
  assets,
  totals,
  publications,
  assetType
}) {
  return {
    type: FETCH_PUBLICATIONS_SUCCESS,
    assets,
    assetType,
    publications,
    totals
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

// Publish LAND

export const PUBLISH_REQUEST = '[Request] Publish Asset'
export const PUBLISH_SUCCESS = '[Success] Publish Asset'
export const PUBLISH_FAILURE = '[Failure] Publish Asset'

export function publishRequest(publication = {}) {
  return {
    type: PUBLISH_REQUEST,
    publication
  }
}

export function publishSuccess(txHash, publication, asset) {
  return {
    type: PUBLISH_SUCCESS,
    ...buildTransactionAction(txHash, {
      tx_hash: publication.tx_hash,
      ...asset
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

export const BUY_REQUEST = '[Request] Buy Asset'
export const BUY_SUCCESS = '[Success] Buy Asset'
export const BUY_FAILURE = '[Failure] Buy Asset'

export function buyRequest(publication = {}) {
  return {
    type: BUY_REQUEST,
    publication
  }
}

export function buySuccess(txHash, publication, asset) {
  return {
    type: BUY_SUCCESS,
    ...buildTransactionAction(txHash, {
      tx_hash: publication.tx_hash,
      price: publication.price,
      buyer: publication.buyer,
      ...asset
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

export const CANCEL_SALE_REQUEST = '[Request] Cancel Asset Sale'
export const CANCEL_SALE_SUCCESS = '[Success] Cancel Asset Sale'
export const CANCEL_SALE_FAILURE = '[Failure] Cancel Asset Sale'

export function cancelSaleRequest(publication = {}) {
  return {
    type: CANCEL_SALE_REQUEST,
    publication
  }
}

export function cancelSaleSuccess(txHash, publication, asset) {
  return {
    type: CANCEL_SALE_SUCCESS,
    ...buildTransactionAction(txHash, {
      tx_hash: publication.tx_hash,
      ...asset
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
