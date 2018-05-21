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
