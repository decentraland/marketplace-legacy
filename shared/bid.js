import { LISTING_STATUS, isOpen } from 'shared/listing'

export function isAssetBid(bid, assetId, assetType) {
  return bid && bid.asset_type === assetType && bid.asset_id === assetId
}

export function hasFingerprintChanged(bid) {
  return bid && bid.status === LISTING_STATUS.fingerprintChanged
}

export function isActive(bid) {
  return isOpen(bid) || hasFingerprintChanged(bid)
}

export function shouldShowBid(bid, isOwner) {
  return (isOwner && isOpen(bid)) || (!isOwner && isActive(bid))
}

export function hasBid(bids, bidder) {
  return bids.some(bid => bid.bidder === bidder)
}
