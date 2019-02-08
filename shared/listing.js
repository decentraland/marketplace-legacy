export const LISTING_STATUS = Object.freeze({
  open: 'open',
  sold: 'sold',
  cancelled: 'cancelled',
  fingerprintChanged: 'fingerPrintChanged'
})

export const LISTING_ASSET_TYPES = Object.freeze({
  parcel: 'parcel',
  estate: 'estate',
  unknow: 'unknow'
})

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
