import { buildCoordinate } from 'lib/utils'

export function shouldConnect(parcelA, parcelB, prop) {
  return (
    parcelA[prop] != null &&
    parcelB[prop] != null &&
    parcelA[prop] === parcelB[prop]
  )
}

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
        shouldConnect(parcels[parcel.id], parcels[leftId], 'district_id')

      parcels[parcel.id].connectedTop =
        !parcels[topId] ||
        shouldConnect(parcels[parcel.id], parcels[topId], 'district_id')

      parcels[parcel.id].connectedTopLeft =
        !parcels[topLeftId] ||
        shouldConnect(parcels[parcel.id], parcels[topLeftId], 'district_id')
    }
  })
  return parcels
}

export function isOwner(wallet, x, y) {
  const parcelId = buildCoordinate(x, y)
  return !!wallet.parcelsById[parcelId]
}
