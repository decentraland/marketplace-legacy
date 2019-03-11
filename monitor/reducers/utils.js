import { env } from 'decentraland-commons'

import { Parcel } from '../../src/Asset'
import { Tile } from '../../src/Tile'
import { ASSET_TYPES } from '../../shared/asset'

// TODO: Find a common place for this
export function getAssetTypeFromEvent(event) {
  const nftAddress = event.args.nftAddress || event.args._tokenAddress

  switch (nftAddress) {
    case env.get('ESTATE_REGISTRY_CONTRACT_ADDRESS'):
      return ASSET_TYPES.estate
    case env.get('LAND_REGISTRY_CONTRACT_ADDRESS'): // Supports the old marketplace, default should be undefined when deprecated
    default:
      return ASSET_TYPES.parcel
  }
}

// TODO: Find a common place for this
export async function getAssetIdFromEvent(event) {
  const nftAddress = event.args.nftAddress || event.args._tokenAddress

  switch (nftAddress) {
    case env.get('ESTATE_REGISTRY_CONTRACT_ADDRESS'):
      return event.args.assetId || event.args._tokenId
    case env.get('LAND_REGISTRY_CONTRACT_ADDRESS'): // Supports the old marketplace, default should be undefined when deprecated
    default:
      return getParcelIdFromEvent(event)
  }
}

// TODO: Find a common place for this
const upsertTimeouts = {}
export function debouncedUpsertTileAsset(assetId, assetType, wait = 5000) {
  const id = `${assetId}-${assetType}`
  const later = function() {
    delete upsertTimeouts[id]
    return Tile.upsertAsset(assetId, assetType)
  }
  clearTimeout(upsertTimeouts[id])
  upsertTimeouts[id] = setTimeout(later, wait)
}

export async function getParcelIdFromEvent(event) {
  const { assetId, landId, _landId, _tokenId } = event.args
  return Parcel.decodeTokenId(assetId || landId || _landId || _tokenId)
}
