export function toPublicationsObject(publicationsArray) {
  return publicationsArray.reduce(
    (obj, publication) => ({
      ...obj,
      [publication.tx_hash]: publication
    }),
    {}
  )
}
