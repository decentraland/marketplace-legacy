import { isOnSale, isOwner } from '../asset'
import { isDistrict, isPlaza, isRoad } from '../district'

export const TYPES = Object.freeze({
  myParcels: 'MY_PARCEL_TYPE',
  myParcelsOnSale: 'MY_PARCEL_ON_SALE_TYPE',
  myEstates: 'MY_ESTATE_TYPE',
  myEstatesOnSale: 'MY_ESTATE_ON_SALE_TYPE',
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
  myEstates: 'ff9990',
  myEstatesOnSale: 'ff4053',
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

export function getColor(x, y, parcel, estates, publications, wallet) {
  const type = getType(parcel, estates, publications, wallet)
  return getColorByType(type, x, y)
}

export function getColorByType(type, x, y) {
  switch (type) {
    case TYPES.loading: {
      const isEven = (x + y) % 2 === 0
      return isEven ? COLORS.loadingEven : COLORS.loadingOdd
    }
    case TYPES.myParcels:
      return COLORS.myParcels
    case TYPES.myParcelsOnSale:
      return COLORS.myParcelsOnSale
    case TYPES.myEstates:
      return COLORS.myParcels
    case TYPES.myEstatesOnSale:
      return COLORS.myParcelsOnSale
    case TYPES.district:
      return COLORS.district
    case TYPES.contribution:
      return COLORS.contribution
    case TYPES.roads:
      return COLORS.roads
    case TYPES.plaza:
      return COLORS.plaza
    case TYPES.taken:
      return COLORS.taken
    case TYPES.onSale:
      return COLORS.onSale
    case TYPES.unowned:
      return COLORS.unowned
    case TYPES.background:
    default:
      return COLORS.background
  }
}

export function getMapAsset(parcelId, parcels, estates) {
  const parcel = parcels[parcelId]
  if (!parcel) {
    return null
  }

  return parcel.estate_id ? estates[parcel.estate_id] : parcel
}

export function getType(parcel, estates, publications, wallet) {
  if (!parcel) {
    return TYPES.loading
  }

  if (isDistrict(parcel)) {
    if (isRoad(parcel.district_id)) {
      return TYPES.roads
    }
    if (isPlaza(parcel.district_id)) {
      return TYPES.plaza
    }
    if (wallet && wallet.contributionsById[parcel.district_id]) {
      return TYPES.contribution
    }
    return TYPES.district
  }

  const isEstate = !!parcel.estate_id
  const isAssetOwner =
    wallet && isOwner(wallet, isEstate ? parcel.estate_id : parcel.id)
  if (parcel.estate_id == '60') {
    debugger
  }
  const isAssetOnSale = isOnSale(
    isEstate ? estates[parcel.estate_id] : parcel,
    publications
  )
  if (isAssetOnSale) {
    return isAssetOwner
      ? isEstate
        ? TYPES.myEstatesOnSale
        : TYPES.myParcelsOnSale
      : TYPES.onSale
  } else {
    return isAssetOwner
      ? isEstate
        ? TYPES.myEstates
        : TYPES.myParcels
      : parcel.owner
        ? TYPES.taken
        : TYPES.unowned
  }
}
