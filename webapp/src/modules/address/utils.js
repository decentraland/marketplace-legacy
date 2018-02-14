export function toAddressParcelIds(parcelsArray) {
  return parcelsArray.map(parcel => parcel.id)
}

export function toAddressPublicationIds(publicationsArray) {
  return publicationsArray.map(publication => publication.tx_hash)
}

export function pickAndMap(all, ids) {
  const array = []
  const byId = {}
  ids.forEach(id => {
    if (all[id]) {
      array.push(all[id])
      byId[id] = all[id]
    }
  })
  return [array, byId]
}
