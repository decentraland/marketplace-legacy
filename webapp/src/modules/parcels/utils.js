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
    const oldParcel = (allParcels && allParcels[parcel.id]) || emptyParcel
    map[parcel.id] = { ...oldParcel, ...parcel }
    return map
  }, {})
}
