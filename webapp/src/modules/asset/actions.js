// Fetch asset

export const FETCH_ASSET = 'Fetch asset'

export function fetchAsset(asset, assetType) {
  return {
    type: FETCH_ASSET,
    asset,
    assetType
  }
}
