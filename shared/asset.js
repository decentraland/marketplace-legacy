import { eth, contracts } from 'decentraland-eth'
import { isParcel } from './parcel'
import { calculateMapProps } from './estate'

export const ASSET_TYPES = Object.freeze({
  estate: 'estate',
  parcel: 'parcel'
})

export const MAX_NAME_LENGTH = 50
export const MAX_DESCRIPTION_LENGTH = 140

export function isValidName(name = '') {
  return name.length > 0 && name.length <= MAX_NAME_LENGTH
}

export function isValidDescription(description = '') {
  return description.length <= MAX_DESCRIPTION_LENGTH
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

export async function getAssetOwnerOnChain(assetType, asset) {
  const tokenId = await getAssetTokenId(assetType, asset)
  return getAssetOwnerOnChainByTokenId(assetType, tokenId)
}

export async function getAssetOwnerOnChainByTokenId(assetType, tokenId) {
  const contract = getContractByAssetType(assetType)
  return contract.ownerOf(tokenId)
}

export async function getAssetTokenId(assetType, asset) {
  switch (assetType) {
    case ASSET_TYPES.parcel: {
      const landRegistry = eth.getContract('LANDRegistry')
      return landRegistry.encodeTokenId(asset.x, asset.y)
    }
    case ASSET_TYPES.estate: {
      return asset.id
    }
    default:
      throw new Error(`The assetType ${assetType} is invalid`)
  }
}

export function getContractByAssetType(assetType) {
  switch (assetType) {
    case ASSET_TYPES.parcel: {
      return eth.getContract('LANDRegistry')
    }
    case ASSET_TYPES.estate: {
      return eth.getContract('EstateRegistry')
    }
    default:
      throw new Error(`The assetType ${assetType} is invalid`)
  }
}
