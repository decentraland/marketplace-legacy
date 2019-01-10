export const LISTING_STATUS = Object.freeze({
  open: 'open',
  sold: 'sold',
  cancelled: 'cancelled'
})

export const LISTING_ASSET_TYPES = Object.freeze({
  parcel: 'parcel',
  estate: 'estate',
  unknow: 'unknow'
})

export function isOpen(listing) {
  return hasStatus(listing, LISTING_STATUS.open)
}

export function hasStatus(listing, status) {
  return listing && listing.status === status && !isExpired(listing.expires_at)
}

export function isExpired(expires_at) {
  return parseInt(expires_at, 10) < Date.now()
}
