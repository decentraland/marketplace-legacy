// Fetch asset

export const FETCH_ASSET = 'Fetch asset'

export function fetchAsset(asset, assetType) {
  return {
    type: FETCH_ASSET,
    asset,
    assetType
  }
}

// Fetch asset listing history

export const FETCH_ASSET_LISTING_HISTORY = 'Fetch asset listing history'

export function fetchAssetListingHistory(asset) {
  return {
    type: FETCH_ASSET_LISTING_HISTORY,
    asset
  }
}
