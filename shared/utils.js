export function isExpired(expires_at) {
  return parseInt(expires_at, 10) < Date.now()
}

export function hasStatus(obj, status) {
  return (
    obj &&
    obj.status === status &&
    obj.tx_status === 'confirmed' &&
    !isExpired(obj.expires_at)
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
    newParcel =>
      !allParcels.some(
        parcel => parcel.x === newParcel.x && parcel.y === newParcel.y
      )
  )
}
