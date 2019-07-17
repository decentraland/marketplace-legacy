import { ASSET_TYPES } from './asset'
import { isDistrict } from './district'
import { isPartOfEstate } from './parcel'

export const LISTING_STATUS = Object.freeze({
  open: 'open',
  sold: 'sold',
  cancelled: 'cancelled',
  fingerprintChanged: 'fingerprintChanged',
  expired: 'expired'
})

export const LISTING_ASSET_TYPES = Object.freeze({
  [ASSET_TYPES.parcel]: ASSET_TYPES.parcel,
  [ASSET_TYPES.estate]: ASSET_TYPES.estate
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
export const MAXIMUM_BID_DAY_INTERVAL = 182 // six months
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

export function publicationToListing(publication) {
  return {
    id: publication.tx_hash,
    type: LISTING_TYPES.PUBLICATION,
    from: publication.owner,
    to: publication.buyer,
    price: publication.price,
    block_number: publication.block_number,
    block_time_created_at: publication.block_time_created_at,
    block_time_updated_at: publication.block_time_updated_at
  }
}

export function bidToListing(bid) {
  return {
    id: bid.id,
    type: LISTING_TYPES.BID,
    from: bid.seller,
    to: bid.bidder,
    price: bid.price,
    block_number: bid.block_number,
    block_time_created_at: bid.block_time_created_at,
    block_time_updated_at: bid.block_time_updated_at
  }
}

export function sortListings(listings, key) {
  if (!Object.values(LISTING_SORT_BY).includes(key)) {
    throw new Error(`Invalid sort listing key ${key}`)
  }

  return listings.sort(
    (a, b) => (parseInt(a[key], 10) > parseInt(b[key], 10) ? -1 : 1)
  )
}

/**
 * Check if the parcel is listable or not
 * @param parcel
 * @return boolean - whether is listable or not
 */
export function isParcelListable(parcel) {
  return isListable(parcel) && !isPartOfEstate(parcel)
}

/**
 * Check if asset is listable or not
 * @param asset
 * @return boolean - whether is listable or not
 */
export function isListable(asset) {
  return !isDistrict(asset) && asset.owner
}
