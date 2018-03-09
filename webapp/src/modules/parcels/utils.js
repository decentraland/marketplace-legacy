export function cleanParcel(parcel) {
  const { publication, ...rest } = parcel
  return {
    ...rest,
    publication_tx_hash: publication ? publication.tx_hash : null
  }
}

export function toParcelObject(parcelsArray) {
  return parcelsArray.reduce((map, parcel) => {
    map[parcel.id] = cleanParcel(parcel)
    return map
  }, {})
}
