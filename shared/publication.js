export const PUBLICATION_STATUS = Object.freeze({
  open: 'open',
  sold: 'sold',
  cancelled: 'cancelled'
})

export const PUBLICATION_ASSET_TYPES = Object.freeze({
  parcel: 'parcel',
  estate: 'estate'
})

export function isOpen(publication) {
  return hasStatus(publication, PUBLICATION_STATUS.open)
}

export function hasStatus(obj, status) {
  return obj && obj.status === status && !isExpired(obj.expires_at)
}

export function isExpired(expires_at) {
  return parseInt(expires_at, 10) < Date.now()
}

export function toPublicationsObject(publicationsArray) {
  return publicationsArray.reduce(
    (obj, publication) => ({
      ...obj,
      [publication.tx_hash]: publication
    }),
    {}
  )
}

export function findAssetPublications(publications, asset, status) {
  return Object.values(publications).filter(
    publication =>
      publication.asset_id === asset.id &&
      (!status || publication.status === status)
  )
}

export function toPublicationObject(publicationsArray) {
  return publicationsArray.reduce((map, publication) => {
    map[publication.tx_hash] = publication
    return map
  }, {})
}
