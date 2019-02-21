import { isDistrict } from './district'

export const LISTING_STATUS = Object.freeze({
  open: 'open',
  sold: 'sold',
  cancelled: 'cancelled',
  fingerprintChanged: 'fingerPrintChanged',
  expired: 'expired'
})

export const LISTING_ASSET_TYPES = Object.freeze({
  parcel: 'parcel',
  estate: 'estate'
})

export const LISTING_TYPES = Object.freeze({
  PUBLICATION: 'publication',
  BID: 'bid',
  AUCTION: 'auction',
  MORTGAGE: 'mortgage'
})

export const LISTING_SORT_BY = Object.freeze({
  BLOCK_UPDATED: 'block_time_updated_at',
  BLOCK_CREATED: 'block_time_created_at'
})

export const DEFAULT_DAY_INTERVAL = 31
export const MINIMUM_DAY_INTERVAL = 1
export const MAXIMUM_BID_DAY_INTERVAL = 182 // six month
export const MAXIMUM_PUBLISH_DAY_INTERVAL = 5 * 365 // 5 years
export const MINIMUM_ASSET_PRICE = 1

export function isOpen(publication) {
  return (
    hasStatus(publication, LISTING_STATUS.open) &&
    !isExpired(publication.expires_at)
  )
}

export function hasStatus(obj, status) {
  return obj && obj.status === status
}

export function isExpired(expires_at) {
  return parseInt(expires_at, 10) < Date.now()
}

export function normalizePublications(publications) {
  return publications.map(publication => ({
    block_number: publication.block_number,
    price: publication.price,
    block_time_created_at: publication.block_time_created_at,
    block_time_updated_at: publication.block_time_updated_at,
    id: publication.tx_hash,
    from: publication.owner,
    to: publication.buyer,
    type: LISTING_TYPES.PUBLICATION
  }))
}

export function normalizeBids(bids) {
  return bids.map(bid => ({
    block_number: bid.block_number,
    price: bid.price,
    block_time_created_at: bid.block_time_created_at,
    block_time_updated_at: bid.block_time_updated_at,
    id: bid.id,
    from: bid.seller,
    to: bid.bidder,
    type: LISTING_TYPES.BID
  }))
}

export function sortListings(listings, key) {
  if (!Object.values(LISTING_SORT_BY).includes(key)) {
    throw 'Invalid key'
  }
  return listings.sort(
    (a, b) => (parseInt(a[key], 10) > parseInt(b[key], 10) ? -1 : 1)
  )
}

/**
 * Check if asset is listable or not
 * @param asset
 * @return boolean - whether is listable or not
 */
export function isListable(asset) {
  return !isDistrict(asset) && asset.owner
}
