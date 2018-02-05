const emptyParcel = {
  x: null,
  y: null,
  price: null,
  owner: null,
  district_id: null,
  data: {
    name: '',
    description: '',
    ipns: null,
    version: 0
  }
}

export function toParcelObject(parcelsArray, allParcels) {
  return parcelsArray.reduce((map, parcel) => {
    const oldParcel = allParcels[parcel.id]
    map[parcel.id] = { ...emptyParcel, ...oldParcel, ...parcel }
    return map
  }, {})
}
