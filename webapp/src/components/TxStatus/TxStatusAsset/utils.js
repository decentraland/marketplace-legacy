import { txUtils } from 'decentraland-eth'
import { buildCoordinate, isParcel } from 'shared/parcel'

export function isAssetPendingTransaction(asset, tx) {
  if (!asset) return false

  const payloadAssetId = isParcel(asset)
    ? buildCoordinate(tx.payload.x, tx.payload.y)
    : tx.payload.id

  return (
    tx.status === txUtils.TRANSACTION_TYPES.pending &&
    payloadAssetId === asset.id
  )
}
