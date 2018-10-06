import { isPending } from '@dapps/modules/transaction/utils'
import { buildCoordinate, isParcel } from 'shared/parcel'

export function isAssetPendingTransaction(asset, tx) {
  if (!asset) return false

  const payloadAssetId = isParcel(asset)
    ? buildCoordinate(tx.payload.x, tx.payload.y)
    : tx.payload.id

  return isPending(tx.status) && asset && payloadAssetId === asset.id
}
