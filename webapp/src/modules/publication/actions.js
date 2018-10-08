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
  assetType
} = {}) {
  return {
    type: FETCH_PUBLICATIONS_REQUEST,
    limit,
    offset,
    sortBy,
    sortOrder,
    status,
    assetType
  }
}

export function fetchPublicationsSuccess({
  assets,
  total,
  publications,
  assetType,
  isGrid
}) {
  return {
    type: FETCH_PUBLICATIONS_SUCCESS,
    assets,
    assetType,
    publications,
    total,
    isGrid
  }
}

export function fetchPublicationsFailure(error) {
  return {
    type: FETCH_PUBLICATIONS_FAILURE,
    error
  }
}

// Fetch Asset Publications

export const FETCH_ASSET_PUBLICATIONS_REQUEST =
  '[Request] Fetch Asset Publications'
export const FETCH_ASSET_PUBLICATIONS_SUCCESS =
  '[Success] Fetch Asset Publications'
export const FETCH_ASSET_PUBLICATIONS_FAILURE =
  '[Failure] Fetch Asset Publications'

export function fetchAssetPublicationsRequest(id, assetType) {
  return {
    type: FETCH_ASSET_PUBLICATIONS_REQUEST,
    id,
    assetType
  }
}

export function fetchAssetPublicationsSuccess(publications, id, assetType) {
  return {
    type: FETCH_ASSET_PUBLICATIONS_SUCCESS,
    publications,
    id,
    assetType
  }
}

export function fetchAssetPublicationsFailure(error) {
  return {
    type: FETCH_ASSET_PUBLICATIONS_FAILURE,
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
