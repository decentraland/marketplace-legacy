import { utils } from 'decentraland-commons'
import { Bounds } from './map'
import { buildCoordinate } from './coordinates'

export const FIRST_AUCTION_DATE = new Date('2018-01-31T00:00:00Z')

export function isParcel(asset) {
  return (
    asset && typeof asset.x !== 'undefined' && typeof asset.y !== 'undefined'
  )
}

export function isEstate(parcel) {
  return parcel.estate_id != null
}

export function toParcelObject(parcelArray) {
  const parcelObject = {}
  for (const parcel of parcelArray) {
    parcelObject[parcel.id] = normalizeParcel(parcel)
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

export function getParcelMatcher(parcel) {
  return parcel2 => isEqualCoords(parcel, parcel2)
}

export function isEqualCoords(p1, p2) {
  return p1.x === p2.x && p1.y === p2.y
}

/*
* Return true if at least one parcel is connected to the one passed as an argument
* @param object parcel
* @param object parcelsAround surrounding parcels
* @return bool whether the parcel has at least one connection
*/
export function hasParcelsConnected(parcel, parcelsAround) {
  const { x, y } = parcel
  const moveUp = { x, y: y + 1 }
  const moveDown = { x, y: y - 1 }
  const moveLeft = { x: x - 1, y }
  const moveRight = { x: x + 1, y }

  const parcelUp = parcelsAround[buildCoordinate(moveUp.x, moveUp.y)]
  const parcelDown = parcelsAround[buildCoordinate(moveDown.x, moveDown.y)]
  const parcelLeft = parcelsAround[buildCoordinate(moveLeft.x, moveLeft.y)]
  const parcelRight = parcelsAround[buildCoordinate(moveRight.x, moveRight.y)]

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
