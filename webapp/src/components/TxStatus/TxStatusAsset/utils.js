import { txUtils } from 'decentraland-eth'
import { buildCoordinate, isParcel } from 'shared/parcel'

export function isParcelPendingTransaction(parcel, tx) {
  return (
    tx.status === txUtils.TRANSACTION_STATUS.pending &&
    buildCoordinate(tx.payload.x, tx.payload.y) === parcel.id
  )
}

export function isAssetPendingTransaction(asset, tx) {
  if (isParcel(asset)) {
    return isParcelPendingTransaction(asset, tx)
  }
  return (
    tx.status === txUtils.TRANSACTION_STATUS.pending &&
    tx.payload.asset_id === asset.asset_id
  )
}
