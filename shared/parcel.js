import { utils } from 'decentraland-commons'
import { Bounds } from './map'
import { buildCoordinate } from './coordinates'

export const AUCTION_DATE = new Date('2018-01-31T00:00:00Z')

export function isParcel(asset) {
  return (
    asset && typeof asset.x !== 'undefined' && typeof asset.y !== 'undefined'
  )
}

export function getParcelSorter() {
  return (parcel1, parcel2) => {
    if (parcel1.x !== parcel2.x) {
      return parcel1.x > parcel2.x ? -1 : 1
    } else {
      return parcel1.y > parcel2.y ? 1 : -1
    }
  }
}

export function toParcelObject(parcelArray, prevParcels = {}) {
  const parcelObject = {}
  for (const parcel of parcelArray) {
    parcelObject[parcel.id] = connectParcel(parcel, parcelObject, prevParcels)
  }
  return parcelObject
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

export function connectParcel(parcel, newParcels, prevParcels) {
  // WARN: this is a copy of /shared/coordinates/buildCoordinate
  // It's here to avoid web-worker limitations when mengling files and it's only used on `connectParcel`
  const _buildCoordinate = (x, y) => `${x},${y}`

  const { id, x, y, estate_id, district_id } = parcel

  const isDistrict = district_id != null
  const isEstate = estate_id != null
  const hasEstateChanged =
    id in prevParcels && prevParcels[id].estate_id !== estate_id

  const newParcel = normalizeParcel(parcel, prevParcels[id])

  if (isDistrict || isEstate || hasEstateChanged) {
    const leftId = _buildCoordinate(x - 1, y)
    const topId = _buildCoordinate(x, y + 1)
    const topLeftId = _buildCoordinate(x - 1, y + 1)

    newParcel.connectedLeft = areConnected(
      newParcel,
      newParcels[leftId] || prevParcels[leftId]
    )
    newParcel.connectedTop = areConnected(
      newParcel,
      newParcels[topId] || prevParcels[topId]
    )
    newParcel.connectedTopLeft = areConnected(
      newParcel,
      newParcels[topLeftId] || prevParcels[topLeftId]
    )
  }

  return newParcel
}

export function areConnected(parcel, sideParcel) {
  if (!sideParcel) {
    return false
  }

  const isSameDistrict = parcel.district_id === sideParcel.district_id
  if (parcel.district_id && isSameDistrict) {
    return true
  }

  const isSameEstate = parcel.estate_id === sideParcel.estate_id
  return parcel.estate_id && isSameEstate
}

export function isSameValue(parcelA, parcelB, prop) {
  return (
    parcelA[prop] != null &&
    parcelB[prop] != null &&
    parcelA[prop] === parcelB[prop]
  )
}

export function getParcelMatcher(parcel) {
  return parcel2 => isEqualCoords(parcel, parcel2)
}

export function isEqualCoords(p1, p2) {
  return p1.x === p2.x && p1.y === p2.y
}

/*
* @dev return true or false whether at least one parcel is connected to the
* given one
* @param object parcel
* @param object allParcels owned by the user
* @return bool where at least the parcel has a connection
*/
export function hasParcelsConnected({ x, y }, parcels) {
  const moveUp = { x, y: y + 1 }
  const moveDown = { x, y: y - 1 }
  const moveLeft = { x: x - 1, y }
  const moveRight = { x: x + 1, y }

  const parcelUp = parcels[buildCoordinate(moveUp.x, moveUp.y)]
  const parcelDown = parcels[buildCoordinate(moveDown.x, moveDown.y)]
  const parcelLeft = parcels[buildCoordinate(moveLeft.x, moveLeft.y)]
  const parcelRight = parcels[buildCoordinate(moveRight.x, moveRight.y)]

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

/**
 * Get the parcels not included in allParcels
 * @param newParcels
 * @param allParcels
 * @return array with parcels of newParcels not included in allParcels
 */
export function getParcelsNotIncluded(newParcels, allParcels) {
  return newParcels.filter(
    newParcel => !allParcels.some(getParcelMatcher(newParcel))
  )
}

/**
 * Check if parcel has tags
 * @param parcel
 * @return boolean - whether has tags or not
 */
export function hasTags(parcel) {
  return parcel && !utils.isEmptyObject(parcel.tags)
}
