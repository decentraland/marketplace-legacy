export const AUCTION_DATE = new Date('2018-01-31T00:00:00Z')

export function buildCoordinate(x, y) {
  return `${x},${y}`
}

export function splitCoordinate(id) {
  return id ? id.split(',') : [0, 0]
}

export function isParcel(asset) {
  return typeof asset.x === 'undefined' && typeof asset.y === 'undefined'
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
    const { id, x, y } = parcel
    if (parcels[id].in_estate || parcels[id].district_id != null) {
      const leftId = buildCoordinate(x - 1, y)
      const topId = buildCoordinate(x, y + 1)
      const topLeftId = buildCoordinate(x - 1, y + 1)

      parcels[id].connectedLeft = areConnected(parcels, id, leftId)
      parcels[id].connectedTop = areConnected(parcels, id, topId)
      parcels[id].connectedTopLeft = areConnected(parcels, id, topLeftId)
    }
  })
  return parcels
}

export function areConnected(parcels, parcelId, sideId) {
  const parcel = parcels[parcelId]
  const sideParcel = parcels[sideId]

  if (!sideParcel) {
    return false
  }

  const sameDistrict = parcel.district_id === sideParcel.district_id
  if (parcel.district_id && sameDistrict) {
    return true
  }

  const sameOwner = parcel.owner === sideParcel.owner
  return parcel.in_estate && parcel.owner && sameOwner
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
