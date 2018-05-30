import { isOpen } from './publication'

export const ROADS_ID = 'f77140f9-c7b4-4787-89c9-9fa0e219b079'
export const PLAZA_ID = '55327350-d9f0-4cae-b0f3-8745a0431099'

export const TYPE = Object.freeze({
  myParcels: 'MY_PARCEL_TYPE',
  myParcelsOnSale: 'MY_PARCEL_ON_SALE_TYPE',
  district: 'DISTRICT_TYPE',
  contribution: 'CONTRIBUTION_TYPE',
  roads: 'ROADS_TYPE',
  plaza: 'PLAZA_TYPE',
  taken: 'TAKEN_TYPE',
  onSale: 'ON_SALE_TYPE',
  unowned: 'UNOWNED_TYPE',
  background: 'BACKGROUND_TYPE',
  loading: 'LOADING_TYPE'
})

export const COLORS = Object.freeze({
  myParcels: '#ff9990',
  myParcelsOnSale: '#ff4053',
  district: '#7773ff',
  contribution: '#4a27d4',
  roads: '#8188a3',
  plaza: '#80c290',
  taken: '#505772',
  onSale: '#00dbef',
  unowned: '#1b1e2d',
  background: '#0d0e18',
  loadingEven: '#131523',
  loadingOdd: '#181a29'
})

export function buildCoordinate(x, y) {
  return `${x},${y}`
}

export function splitCoordinate(id) {
  return id ? id.split(',') : [0, 0]
}

export function isRoad(district_id) {
  return district_id === ROADS_ID
}

export function isPlaza(district_id) {
  return district_id === PLAZA_ID
}

export function isDistrict(parcel) {
  return !!parcel.district_id
}

export function getDistrict(parcel, districts = {}) {
  return parcel && districts[parcel.district_id]
}

export function isOnSale(parcel) {
  return parcel != null && isOpen(parcel.publication)
}

export function getType(id, x, y, parcels, wallet) {
  const parcel = parcels[id]
  if (!parcel) {
    return TYPE.loading
  }

  if (isDistrict(parcel)) {
    if (isRoad(parcel.district_id)) {
      return TYPE.roads
    }
    if (isPlaza(parcel.district_id)) {
      return TYPE.plaza
    }
    if (wallet && wallet.contributionsById[parcel.district_id]) {
      return TYPE.contribution
    }
    return TYPE.district
  }

  if (wallet && wallet.parcelsById[parcel.id]) {
    return isOnSale(parcel) ? TYPE.myParcelsOnSale : TYPE.myParcels
  }

  if (!parcel.owner && !parcel.district_id) {
    return TYPE.unowned
  }

  if (isOnSale(parcel)) {
    return TYPE.onSale
  }

  return TYPE.taken
}

export function getColor(id, x, y, parcels, wallet) {
  const type = getType(id, x, y, parcels, wallet)
  switch (type) {
    case TYPE.loading: {
      const isEven = (x + y) % 2 === 0
      console.log(x, y, isEven)
      return isEven ? COLORS.loadingEven : COLORS.loadingOdd
    }
    case TYPE.myParcels:
      return COLORS.myParcels
    case TYPE.myParcelsOnSale:
      return COLORS.myParcelsOnSale
    case TYPE.district:
      return COLORS.district
    case TYPE.contribution:
      return COLORS.contribution
    case TYPE.roads:
      return COLORS.roads
    case TYPE.plaza:
      return COLORS.plaza
    case TYPE.taken:
      return COLORS.taken
    case TYPE.onSale:
      return COLORS.onSale
    case TYPE.unowned:
      return COLORS.unowned
    case TYPE.background:
    default:
      return COLORS.background
  }
}

export function getTextColor(id, x, y, wallet, parcels) {
  const type = getType(id, x, y, wallet, parcels)
  switch (type) {
    case TYPE.loading:
    case TYPE.district:
    case TYPE.contribution:
    case TYPE.roads:
    case TYPE.taken:
    case TYPE.unowned:
    case TYPE.background:
      return 'white'

    case TYPE.myParcels:
    case TYPE.myParcelsOnSale:
    case TYPE.plaza:
    case TYPE.onSale:
    default:
      return 'black'
  }
}

export function toParcelObject(
  parcelsArray,
  prevParcels = [],
  normalize = false
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
  const { publication, ...rest } = parcel
  return {
    ...prevParcel,
    ...rest,
    publication_tx_hash: publication ? publication.tx_hash : null
  }
}

export function connectParcels(array, parcels) {
  array.forEach(parcel => {
    const { x, y } = parcel
    if (parcels[parcel.id].district_id != null) {
      const leftId = buildCoordinate(x - 1, y)
      const topId = buildCoordinate(x, y + 1)
      const topLeftId = buildCoordinate(x - 1, y + 1)

      parcels[parcel.id].connectedLeft =
        !parcels[leftId] ||
        isSameValue(parcels[parcel.id], parcels[leftId], 'district_id')

      parcels[parcel.id].connectedTop =
        !parcels[topId] ||
        isSameValue(parcels[parcel.id], parcels[topId], 'district_id')

      parcels[parcel.id].connectedTopLeft =
        !parcels[topLeftId] ||
        isSameValue(parcels[parcel.id], parcels[topLeftId], 'district_id')
    }
  })
  return parcels
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
