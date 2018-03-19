import { txUtils } from 'decentraland-commons'

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

export function toPublicationObject(publicationsArray) {
  return publicationsArray.reduce((map, publication) => {
    map[publication.tx_hash] = publication
    return map
  }, {})
}

export function isOpen(publication) {
  return (
    publication.status === PUBLICATION_STATUS.open &&
    publication.tx_status === txUtils.TRANSACTION_STATUS.confirmed &&
    !isExpired(publication)
  )
}

export function isExpired(publication) {
  return new Date(publication.expires_at).getTime() < Date.now()
}

// From Publication.js on the server
export const PUBLICATION_STATUS = Object.freeze({
  open: 'open',
  sold: 'sold',
  cancelled: 'cancelled'
})
