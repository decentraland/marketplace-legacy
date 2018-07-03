export function isEstate(asset) {
  return !!asset.parcels
}

export function getEstateByParcel(parcel, estates) {
  return Object.keys(estates)
    .map(estateId => estates[estateId])
    .find(estate => estate.id === parcel.owner)
}

export function toEstateObject(estatesArray) {
  const estate = {}
  estatesArray.forEach(e => {
    estate[e.id] = e
    estate[e.id].parcels = e.data.parcels
  })
  return estate
}
