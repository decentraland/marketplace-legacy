import { buildCoordinate } from 'lib/utils'

export function cleanParcel(parcel, prevParcel) {
  const { publication, ...rest } = parcel
  return {
    ...prevParcel,
    ...rest,
    publication_tx_hash: publication ? publication.tx_hash : null
  }
}

export function toParcelObject(parcelsArray, prevParcels) {
  return connectParcels(
    parcelsArray,
    parcelsArray.reduce((map, parcel) => {
      map[parcel.id] = cleanParcel(parcel, prevParcels[parcel.id])
      return map
    }, {})
  )
}

export function getParcelPublications(parcels) {
  return parcels.reduce((pubs, parcel) => {
    if (parcel.publication) pubs.push(parcel.publication)
    return pubs
  }, [])
}

export function connectParcels(array, parcels) {
  array.forEach(parcel => {
    const { x, y } = parcel
    if (parcels[parcel.id].district_id != null) {
      const leftId = buildCoordinate(x - 1, y)
      const topId = buildCoordinate(x, y + 1)
      const topLeftId = buildCoordinate(x - 1, y + 1)

      parcels[parcel.id].connectedLeft =
        !parcels[leftId] ||
        parcels[parcel.id].district_id === parcels[leftId].district_id

      parcels[parcel.id].connectedTop =
        !parcels[topId] ||
        parcels[parcel.id].district_id === parcels[topId].district_id

      parcels[parcel.id].connectedTopLeft =
        !parcels[topLeftId] ||
        parcels[parcel.id].district_id === parcels[topLeftId].district_id
    }
  })
  return parcels
}
