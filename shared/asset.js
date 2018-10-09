import { contracts } from 'decentraland-eth'
import { isOpen } from './publication'
import { isParcel } from './parcel'
import { isEstate, calculateMapProps } from './estate'

export const ROADS_ID = 'f77140f9-c7b4-4787-89c9-9fa0e219b079'
export const PLAZA_ID = '55327350-d9f0-4cae-b0f3-8745a0431099'

export const TYPES = Object.freeze({
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

export const ASSET_TYPES = Object.freeze({
  estate: 'estate',
  parcel: 'parcel'
})

export function isExpired(expires_at) {
  return parseInt(expires_at, 10) < Date.now()
}

export function hasStatus(obj, status) {
  return obj && obj.status === status && !isExpired(obj.expires_at)
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
    return {}
  }

  return {
    asset: parcel.estate_id ? estates[parcel.estate_id] : parcel
  }
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
    return TYPES.loading
  }
  const isAssetOwner = wallet && isOwner(wallet, asset.id)
  if (isEstate(asset)) {
    if (isOnSale(asset, publications) && isAssetOwner) {
      return TYPES.myParcelsOnSale
    }
    if (isOnSale(asset, publications)) {
      return TYPES.onSale
    }
    return isAssetOwner ? TYPES.myEstates : TYPES.taken
  }

  if (isDistrict(asset)) {
    if (isRoad(asset.district_id)) {
      return TYPES.roads
    }
    if (isPlaza(asset.district_id)) {
      return TYPES.plaza
    }
    if (wallet && wallet.contributionsById[asset.district_id]) {
      return TYPES.contribution
    }
    return TYPES.district
  }

  if (isAssetOwner) {
    return isOnSale(asset, publications)
      ? TYPES.myParcelsOnSale
      : TYPES.myParcels
  }

  if (!asset.owner && !asset.district_id) {
    return TYPES.unowned
  }

  if (isOnSale(asset, publications)) {
    return TYPES.onSale
  }

  return TYPES.taken
}

export function isValidName(name = '') {
  return name.length > 0 && name.length <= 50
}

export function isValidDescription(description = '') {
  return description.length <= 140
}

export function getCenterCoords(asset) {
  if (isParcel(asset)) {
    return { x: asset.x, y: asset.y }
  }
  const { center } = calculateMapProps(asset.data.parcels)
  return center
}

export function decodeMetadata(data) {
  return contracts.LANDRegistry.decodeLandData(data)
}

export function encodeMetadata(data) {
  return contracts.LANDRegistry.encodeLandData(data)
}

export function getAssetPublications(assets) {
  return assets.reduce((pubs, asset) => {
    if (asset.publication) pubs.push(asset.publication)
    return pubs
  }, [])
}
