import { env } from 'decentraland-commons'
import { Parcel } from '../../src/Asset'
import { ASSET_TYPES } from '../../shared/asset'

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
