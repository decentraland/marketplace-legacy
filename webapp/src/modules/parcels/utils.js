export function toParcelObject(parcelsArray) {
  return parcelsArray.reduce((map, parcel) => {
    map[parcel.id] = parcel
    return map
  }, {})
}
