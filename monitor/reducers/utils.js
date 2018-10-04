import { env } from 'decentraland-commons'
import { Parcel } from '../../src/Asset'
import { ASSET_TYPES } from '../../shared/asset'

// TODO: Find a common place for this
export function getAssetTypeFromEvent(event) {
  const nftAddress = event.args.nftAddress

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
  const nftAddress = event.args.nftAddress

  switch (nftAddress) {
    case env.get('ESTATE_REGISTRY_CONTRACT_ADDRESS'):
      return event.args.assetId
    case env.get('LAND_REGISTRY_CONTRACT_ADDRESS'): // Supports the old marketplace, default should be undefined when deprecated
    default:
      return getParcelIdFromEvent(event)
  }
}

export async function getParcelIdFromEvent(event) {
  const { assetId, landId, _landId } = event.args
  return Parcel.decodeTokenId(assetId || landId || _landId)
}
