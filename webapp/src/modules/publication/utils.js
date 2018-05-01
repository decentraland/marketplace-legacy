import { txUtils } from 'decentraland-eth'

// From Publication.js on the server
export const PUBLICATION_STATUS = Object.freeze({
  open: 'open',
  sold: 'sold',
  cancelled: 'cancelled'
})

export function toPublicationsObject(publicationsArray) {
  return publicationsArray.reduce(
    (obj, publication) => ({
      ...obj,
      [publication.tx_hash]: publication
    }),
    {}
  )
}

export function findPublicationByCoordinates(publications, x, y) {
  return Object.values(publications).find(
    publication =>
      publication.x === x &&
      publication.y === y &&
      publication.status === PUBLICATION_STATUS.open
  )
}

export function findParcelPublications(parcel, publications, status) {
  return Object.values(publications).filter(
    publication =>
      publication.x === parcel.x &&
      publication.y === parcel.y &&
      (!status || publication.status === status)
  )
}

export function toPublicationObject(publicationsArray) {
  return publicationsArray.reduce((map, publication) => {
    map[publication.tx_hash] = publication
    return map
  }, {})
}

export function isOpen(publication) {
  return hasStatus(publication, PUBLICATION_STATUS.open)
}

export function hasStatus(publication, status) {
  return (
    publication &&
    publication.status === status &&
    publication.tx_status === txUtils.TRANSACTION_STATUS.confirmed &&
    !isExpired(publication)
  )
}

export function isExpired(publication) {
  return parseInt(publication.expires_at, 10) < Date.now()
}
