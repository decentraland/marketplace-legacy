import { Parcel } from '../../src/Parcel'

export async function getParcelIdFromEvent(event) {
  const { assetId, landId, _landId } = event.args
  return Parcel.decodeAssetId(assetId || landId || _landId)
}
