import { Bounds } from './map'

export const AUCTION_DATE = new Date('2018-01-31T00:00:00Z')

export function buildCoordinate(x, y) {
  return `${x},${y}`
}

export function splitCoordinate(id) {
  let ids = [0, 0]
  if (id) {
    ids = id.split(',').map(coord => parseInt(coord, 10))
  }
  return ids
}

export function isParcel(asset) {
  return (
    asset && typeof asset.x !== 'undefined' && typeof asset.y !== 'undefined'
  )
}

export function toParcelObject(
  parcelsArray,
  prevParcels = [],
  normalize = true,
  redoConnections = false
) {
  return connectParcels(
    parcelsArray,
    parcelsArray.reduce((map, parcel) => {
      map[parcel.id] = normalize
        ? normalizeParcel(parcel, prevParcels[parcel.id])
        : parcel
      return map
    }, {}),
    redoConnections
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

export function connectParcels(parcelArray, parcels, redoConnections = false) {
  for (const parcel of parcelArray) {
    const { id, x, y } = parcel
    if (
      parcels[id].estate_id ||
      parcels[id].district_id != null ||
      redoConnections
    ) {
      const leftId = buildCoordinate(x - 1, y)
      const topId = buildCoordinate(x, y + 1)
      const topLeftId = buildCoordinate(x - 1, y + 1)
      parcels[id].connectedLeft = areConnected(parcels, id, leftId)
      parcels[id].connectedTop = areConnected(parcels, id, topId)
      parcels[id].connectedTopLeft = areConnected(parcels, id, topLeftId)
    }
  }

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
  return parcel.estate_id && parcel.owner && sameOwner
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

/*
* @dev return true or false whether at least one parcel is connected to the
* given one
* @param object parcel
* @param object allParcels owned by the user
* @return bool where at least the parcel has a connection
*/
export function hasParcelsConnected({ x, y }, parcels) {
  const moveUp = { x, y: y + 1 },
    moveDown = { x, y: y - 1 },
    moveLeft = { x: x - 1, y },
    moveRight = { x: x + 1, y }

  const parcelUp = parcels[buildCoordinate(moveUp.x, moveUp.y)],
    parcelDown = parcels[buildCoordinate(moveDown.x, moveDown.y)],
    parcelLeft = parcels[buildCoordinate(moveLeft.x, moveLeft.y)],
    parcelRight = parcels[buildCoordinate(moveRight.x, moveRight.y)]

  return (
    (Bounds.inBounds(moveUp.x, moveUp.y) && parcelUp && !parcelUp.estate_id) ||
    (Bounds.inBounds(moveDown.x, moveDown.y) &&
      parcelDown &&
      !parcelDown.estate_id) ||
    (Bounds.inBounds(moveLeft.x, moveLeft.y) &&
      parcelLeft &&
      !parcelLeft.estate_id) ||
    (Bounds.inBounds(moveRight.x, moveRight.y) &&
      parcelRight &&
      !parcelRight.estate_id)
  )
}
