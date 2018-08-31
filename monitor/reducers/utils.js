import { Parcel } from '../../src/Parcel'

export async function getParcelIdFromEvent(event) {
  const { assetId, landId, _landId } = event.args
  return Parcel.decodeTokenId(assetId || landId || _landId)
}
