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
  myEstates: '#ff9990',
  myEstatesOnSale: '#ff4053',
  district: '#5054D4',
  contribution: '#563db8',
  roads: '#716C7A',
  plaza: '#70AC76',
  taken: '#3D3A46',
  onSale: '#00d3ff',
  unowned: '#09080A',
  background: '#18141a',
  loadingEven: '#110e13',
  loadingOdd: '#0d0b0e'
})

export function getColor(x, y, parcel, estates, publications, wallet, colors) {
  const type = getType(parcel, estates, publications, wallet)
  return getColorByType(type, x, y, colors)
}

export function getColorByType(type, x, y, colors = COLORS) {
  switch (type) {
    case TYPES.loading: {
      const isEven = (x + y) % 2 === 0
      return isEven ? colors.loadingEven : colors.loadingOdd
    }
    case TYPES.myParcels:
      return colors.myParcels
    case TYPES.myParcelsOnSale:
      return colors.myParcelsOnSale
    case TYPES.myEstates:
      return colors.myParcels
    case TYPES.myEstatesOnSale:
      return colors.myParcelsOnSale
    case TYPES.district:
      return colors.district
    case TYPES.contribution:
      return colors.contribution
    case TYPES.roads:
      return colors.roads
    case TYPES.plaza:
      return colors.plaza
    case TYPES.taken:
      return colors.taken
    case TYPES.onSale:
      return colors.onSale
    case TYPES.unowned:
      return colors.unowned
    case TYPES.background:
    default:
      return colors.background
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
