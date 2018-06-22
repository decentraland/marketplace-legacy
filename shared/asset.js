import { isOpen } from './publication'
import { getEstateByParcel, isEstate } from './estate'

export const ROADS_ID = 'f77140f9-c7b4-4787-89c9-9fa0e219b079'
export const PLAZA_ID = '55327350-d9f0-4cae-b0f3-8745a0431099'

export const TYPE = Object.freeze({
  myParcels: 'MY_PARCEL_TYPE',
  myParcelsOnSale: 'MY_PARCEL_ON_SALE_TYPE',
  myEstates: 'MY_ESTATE_TYPE',
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

export function isRoad(district_id) {
  return district_id === ROADS_ID
}

export function isPlaza(district_id) {
  return district_id === PLAZA_ID
}

export function isDistrict(asset) {
  return !!asset.district_id
}

export function getDistrict(asset, districts = {}) {
  return asset && districts[asset.district_id]
}

export function getOpenPublication(asset, publications) {
  if (asset && publications && asset.publication_tx_hash in publications) {
    const publication = publications[asset.publication_tx_hash]
    if (isOpen(publication)) {
      return publication
    }
  }
  return null
}

export function isOnSale(asset, publications) {
  return getOpenPublication(asset, publications) != null
}

export function getColor(x, y, asset, publications, wallet) {
  const type = getType(asset, publications, wallet)
  return getColorByType(type, x, y)
}

export function getColorByType(type, x, y) {
  switch (type) {
    case TYPE.loading: {
      const isEven = (x + y) % 2 === 0
      return isEven ? COLORS.loadingEven : COLORS.loadingOdd
    }
    case TYPE.myParcels:
      return COLORS.myParcels
    case TYPE.myParcelsOnSale:
      return COLORS.myParcelsOnSale
    case TYPE.myEstates:
      return COLORS.myParcels
    case TYPE.myEstatesOnSale:
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

export function getAsset(parcelId, parcels, estates) {
  const parcel = parcels[parcelId]
  if (!parcel) {
    return null
  }

  if (!parcel.in_estate) {
    return parcel
  }

  return getEstateByParcel(parcel, estates)
}

export function isOwner(wallet, assetId) {
  if (!wallet) {
    return false
  }

  if (wallet.parcelsById && wallet.parcelsById[assetId]) {
    return true
  }

  return !!(wallet.estatesById && wallet.estatesById[assetId])
}

export function getType(asset, publications, wallet) {
  if (!asset) {
    return TYPE.loading
  }

  if (isEstate(asset)) {
    return wallet && isOwner(wallet, asset.id) ? TYPE.myEstates : TYPE.taken
  }

  if (isDistrict(asset)) {
    if (isRoad(asset.district_id)) {
      return TYPE.roads
    }
    if (isPlaza(asset.district_id)) {
      return TYPE.plaza
    }
    if (wallet && wallet.contributionsById[asset.district_id]) {
      return TYPE.contribution
    }
    return TYPE.district
  }

  if (wallet && isOwner(wallet, asset.id)) {
    return isOnSale(asset, publications) ? TYPE.myParcelsOnSale : TYPE.myParcels
  }

  if (!asset.owner && !asset.district_id) {
    return TYPE.unowned
  }

  if (isOnSale(asset, publications)) {
    return TYPE.onSale
  }

  return TYPE.taken
}

export function isValidName(name) {
  return name <= 50
}

export function isValidDescription(description) {
  return description <= 140
}

export const ASSET_TYPE = Object.freeze({
  estate: 'estate',
  parcel: 'parcel'
})
