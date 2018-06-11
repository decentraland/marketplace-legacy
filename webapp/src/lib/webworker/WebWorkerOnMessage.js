/* eslint-disable */

export function WebWorkerOnMessage(event) {
  const action = event.data
  let result = {}

  switch (action.type) {
    case 'FETCH_PARCELS_REQUEST':
    case 'FETCH_ADDRESS_PARCELS_REQUEST': {
      const { parcels, allParcels } = action
      const parcelObject = toParcelObject(parcels, allParcels)
      const publications = getParcelPublications(parcels)
      result = {
        parcels: parcelObject,
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
