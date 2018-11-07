import { isPending } from '@dapps/modules/transaction/utils'
import { isParcel } from 'shared/parcel'
import { buildCoordinate } from 'shared/coordinates'

export function isAssetPendingTransaction(asset, tx) {
  if (!asset) return false

  let payloadAssetId
  try {
    payloadAssetId = isParcel(asset)
      ? buildCoordinate(tx.payload.x, tx.payload.y)
      : tx.payload.id
  } catch (error) {
    return false
  }

  return isPending(tx.status) && payloadAssetId === asset.id
}
