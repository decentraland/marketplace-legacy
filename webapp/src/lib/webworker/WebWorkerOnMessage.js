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

  //
  // Utils

  function shouldConnect(parcelA, parcelB, prop) {
    return (
      parcelA[prop] != null &&
      parcelB[prop] != null &&
      parcelA[prop] === parcelB[prop]
    )
  }

  function toParcelObject(parcelsArray, prevParcels) {
    return connectParcels(
      parcelsArray,
      parcelsArray.reduce((map, parcel) => {
        map[parcel.id] = cleanParcel(parcel, prevParcels[parcel.id])
        return map
      }, {})
    )
  }

  function getParcelPublications(parcels) {
    return parcels.reduce((pubs, parcel) => {
      if (parcel.publication) pubs.push(parcel.publication)
      return pubs
    }, [])
  }

  function connectParcels(parcelsArray, prevParcels) {
    for (let i = 0; i < parcelsArray.length; i++) {
      const parcel = parcelsArray[i]
      const { x, y } = parcel

      if (prevParcels[parcel.id].district_id != null) {
        const leftId = buildCoordinate(x - 1, y)
        const topId = buildCoordinate(x, y + 1)
        const topLeftId = buildCoordinate(x - 1, y + 1)

        const prevParcel = prevParcels[parcel.id]

        prevParcel.connectedLeft =
          !prevParcels[leftId] ||
          shouldConnect(prevParcel, prevParcels[leftId], 'district_id')

        prevParcel.connectedTop =
          !prevParcels[topId] ||
          shouldConnect(prevParcel, prevParcels[topId], 'district_id')

        prevParcel.connectedTopLeft =
          !prevParcels[topLeftId] ||
          shouldConnect(prevParcel, prevParcels[topLeftId], 'district_id')
      }
    }
    return prevParcels
  }

  function cleanParcel(parcel, prevParcel) {
    const publication = parcel.publication
    const rest = extend(parcel, prevParcel)

    delete rest.publications
    rest.publication_tx_hash = publication ? publication.tx_hash : null

    return rest
  }

  function extend(base, extras) {
    const result = {}

    for (const key in base) {
      result[key] = base[key]
    }
    for (const key in extras) {
      result[key] = extras[key]
    }

    return result
  }

  function buildCoordinate(x, y) {
    return `${x},${y}`
  }
}
