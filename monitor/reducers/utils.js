import { Parcel } from '../../src/Asset'

export async function getParcelIdFromEvent(event) {
  const { assetId, landId, _landId } = event.args
  return Parcel.decodeTokenId(assetId || landId || _landId)
}
