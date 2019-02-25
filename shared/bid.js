import { LISTING_STATUS, isOpen } from 'shared/listing'

export function isAssetBid(bid, assetId, assetType) {
  return bid && bid.asset_type === assetType && bid.asset_id === assetId
}

export function fingerprintHasChanged(bid) {
  return bid.status === LISTING_STATUS.fingerprintChanged
}

export function isActive(bid) {
  return isOpen(bid) || fingerprintHasChanged(bid)
}
