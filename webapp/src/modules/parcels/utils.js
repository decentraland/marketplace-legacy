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

export function toParcelObject(parcelsArray) {
  return parcelsArray.reduce((map, parcel) => {
    map[parcel.id] = { ...emptyParcel, ...parcel }
    return map
  }, {})
}
