export const LISTING_STATUS = Object.freeze({
  open: 'open',
  sold: 'sold',
  cancelled: 'cancelled',
  fingerprintChanged: 'fingerPrintChanged'
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

export const DEFAULT_DAY_INTERVAL = 31
export const MINIMUM_DAY_INTERVAL = 1
export const MAXIMUM_BID_DAY_INTERVAL = 6 * 31 // six month
export const MAXIMUM_PUBLISH_DAY_INTERVAL = 5 * 365 // 5 years
export const MINIMUM_ASSET_PRICE = 1

export function isOpen(listing) {
  return hasStatus(listing, LISTING_STATUS.open)
}

export function hasStatus(listing, status) {
  return listing && listing.status === status && !isExpired(listing.expires_at)
}

export function isExpired(expires_at) {
  return parseInt(expires_at, 10) < Date.now()
}
