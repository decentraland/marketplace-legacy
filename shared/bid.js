export function isAssetBid(bid, assetType, assetId) {
  return bid && bid.asset_type === assetType && bid.asset_id === assetId
}
