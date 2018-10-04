/* eslint-disable */

export function WebWorkerOnMessage(event) {
  const action = event.data
  let result = {}

  switch (action.type) {
    case 'FETCH_MAP_REQUEST':
    case 'FETCH_ADDRESS_PARCELS_REQUEST': {
      const { parcels, allParcels } = action
      const parcelObject = toParcelObject(parcels, allParcels)
      const publications = getAssetPublications(parcels)
      result = {
        parcels: parcelObject,
        publications
      }
      break
    }
    case 'FETCH_ADDRESS_ESTATES_REQUEST': {
      const { estates, allEstates } = action
      const estateObject = toEstateObject(estates)
      const publications = getAssetPublications(estates)
      result = {
        estates: estateObject,
        publications
      }
      break
    }
    default:
      break
  }

  result.type = action.type
  result.timestamp = action.timestamp

  self.postMessage(result)
}
