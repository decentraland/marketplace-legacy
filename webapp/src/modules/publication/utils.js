import { isOpen } from 'lib/utils'

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

export const isPublicationOpen = publication =>
  isOpen(publication, PUBLICATION_STATUS.open)
