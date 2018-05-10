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

  self.postMessage(
    Object.assign({ type: action.type, timestamp: action.timestamp }, result)
  )

  //
  // Utils

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
          prevParcel.district_id === prevParcels[leftId].district_id

        prevParcel.connectedTop =
          !prevParcels[topId] ||
          prevParcel.district_id === prevParcels[topId].district_id

        prevParcel.connectedTopLeft =
          !prevParcels[topLeftId] ||
          prevParcel.district_id === prevParcels[topLeftId].district_id
      }
    }
    return prevParcels
  }

  function cleanParcel(parcel, prevParcel) {
    const rest = {}
    const publication = parcel.publication

    for (const key in parcel) {
      if (key !== 'publications') {
        rest[key] = parcel[key]
      }
    }

    return Object.assign({}, prevParcel, rest, {
      publication_tx_hash: publication ? publication.tx_hash : null
    })
  }

  function buildCoordinate(x, y) {
    return `${x},${y}`
  }
}
