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
    publication => publication.x === x && publication.y === y
  )
}
