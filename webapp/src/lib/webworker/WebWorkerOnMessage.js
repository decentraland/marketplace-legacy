/* eslint-disable */

export function WebWorkerOnMessage(event) {
  const action = event.data
  let result = {}

  switch (action.type) {
    case 'FETCH_MAP_REQUEST': {
      const { assets, allParcels } = action
      const parcelObject = toParcelObject(assets.parcels, allParcels)
      const estateObject = toEstateObject(assets.estates)
      const parcelPublications = getAssetPublications(assets.parcels)
      const estatePublications = getAssetPublications(assets.estates)

      result = {
        parcels: parcelObject,
        estates: estateObject,
        publications: parcelPublications.concat(estatePublications)
      }
      break
    }
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
      const { estates } = action
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
