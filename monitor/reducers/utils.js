import { Parcel } from '../../src/Parcel'

export async function getParcelIdFromEvent(event) {
  const { assetId, landId } = event.args
  return Parcel.decodeAssetId(assetId || landId)
}

export async function getEstateIdFromEvent(event) {
  const { assetId, landId } = event.args
  return Parcel.decodeAssetId(assetId || landId)
}
