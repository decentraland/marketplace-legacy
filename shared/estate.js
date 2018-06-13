export function isEstate(asset) {
  return !!asset.parcels
}

export function getEstateByParcel(parcel, estates) {
  return Object.keys(estates)
    .map(estateId => estates[estateId])
    .find(estate => estate.parcels.some(p => p.id === parcel.id))
}

export function areOnSameEstate(parcels) {
  const { owner } = parcels[0]
  return parcels.every(parcel => parcel.in_estate && parcel.owner === owner)
}
