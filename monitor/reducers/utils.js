import { env } from 'decentraland-commons'
import { Parcel } from '../../src/Asset'
import { ASSET_TYPES } from '../../shared/asset'

export function getAssetTypeFromEvent(event) {
  const nftAddress = event.args.nftAddress

  switch (nftAddress) {
    case env.get('LAND_REGISTRY_CONTRACT_ADDRESS'):
      return ASSET_TYPES.parcel
    case env.get('ESTATE_REGISTRY_CONTRACT_ADDRESS'):
      return ASSET_TYPES.estate
    default:
      return null
  }
}

export async function getAssetIdFromEvent(event) {
  const nftAddress = event.args.nftAddress

  switch (nftAddress) {
    case env.get('LAND_REGISTRY_CONTRACT_ADDRESS'):
      return getParcelIdFromEvent(event)
    case env.get('ESTATE_REGISTRY_CONTRACT_ADDRESS'):
      return event.args.assetId
    default:
      return null
  }
}

export async function getParcelIdFromEvent(event) {
  const { assetId, landId, _landId } = event.args
  return Parcel.decodeTokenId(assetId || landId || _landId)
}
