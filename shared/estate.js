export function isEstate(asset) {
  return !!asset.parcels
}

export const getEstateByParcel = (parcel, estates) => {
  return Object.keys(estates)
    .map(estateId => estates[estateId])
    .find(estate => estate.parcels.some(p => p.id === parcel.id))
}
