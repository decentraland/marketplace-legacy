// Fetch asset

export const FETCH_ASSET_REQUEST = '[Request] Fetch Asset'
export const FETCH_ASSET_SUCCESS = '[Success] Fetch Asset'
export const FETCH_ASSET_FAILURE = '[Failure] Fetch Asset'

export function fetchAssetRequest(assetId, assetType) {
  return {
    type: FETCH_ASSET_REQUEST,
    assetId,
    assetType
  }
}

export function fetchAssetSuccess(asset, assetType) {
  return {
    type: FETCH_ASSET_SUCCESS,
    asset,
    assetType
  }
}

export function fetchAssetFailure(error) {
  return {
    type: FETCH_ASSET_FAILURE,
    error
  }
}

// Navigate to Asset

export const NAVIGATE_TO_ASSET = 'Navigate to asset'

export function navigateToAsset(assetId, assetType) {
  return {
    type: NAVIGATE_TO_ASSET,
    assetId,
    assetType
  }
}

// Fetch asset listing history

export const FETCH_ASSET_LISTING_HISTORY = 'Fetch asset listing history'

export function fetchAssetListingHistory(asset, assetType) {
  return {
    type: FETCH_ASSET_LISTING_HISTORY,
    asset,
    assetType
  }
}
