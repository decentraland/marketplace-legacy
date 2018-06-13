export const AUCTION_DATE = new Date('2018-01-31T00:00:00Z')

export function buildCoordinate(x, y) {
  return `${x},${y}`
}

export function splitCoordinate(id) {
  return id ? id.split(',') : [0, 0]
}

export function isParcel(asset) {
  return !!asset.x
}

export function toParcelObject(
  parcelsArray,
  prevParcels = [],
  normalize = true
) {
  return connectParcels(
    parcelsArray,
    parcelsArray.reduce((map, parcel) => {
      map[parcel.id] = normalize
        ? normalizeParcel(parcel, prevParcels[parcel.id])
        : parcel
      return map
    }, {})
  )
}

export function normalizeParcel(parcel, prevParcel = {}) {
  const normalizedParcel = Object.assign(
    { publication_tx_hash_history: [] },
    prevParcel,
    parcel
  )
  const publication = normalizedParcel.publication
  delete normalizedParcel.publication
  normalizedParcel.publication_tx_hash = publication
    ? publication.tx_hash
    : null
  return normalizedParcel
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
        isSameValue(parcels[parcel.id], parcels[leftId], 'district_id')

      parcels[parcel.id].connectedTop =
        !parcels[topId] ||
        isSameValue(parcels[parcel.id], parcels[topId], 'district_id')

      parcels[parcel.id].connectedTopLeft =
        !parcels[topLeftId] ||
        isSameValue(parcels[parcel.id], parcels[topLeftId], 'district_id')
    }
  })
  return parcels
}

export function isSameValue(parcelA, parcelB, prop) {
  return (
    parcelA[prop] != null &&
    parcelB[prop] != null &&
    parcelA[prop] === parcelB[prop]
  )
}

export function getParcelPublications(parcels) {
  return parcels.reduce((pubs, parcel) => {
    if (parcel.publication) pubs.push(parcel.publication)
    return pubs
  }, [])
}

export function isEqualCoords(p1, p2) {
  return p1.x === p2.x && p1.y === p2.y
}

export function getCoordsMatcher(coords) {
  return coords2 => isEqualCoords(coords, coords2)
}

export function isValidName(name) {
  return name <= 50
}

export function isValidDescription(description) {
  return description <= 140
}
