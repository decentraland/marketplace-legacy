export function isAssetBid(bid, assetId, assetType) {
  return bid && bid.asset_type === assetType && bid.asset_id === assetId
}
