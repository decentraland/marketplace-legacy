import { txUtils } from 'decentraland-eth'
import { buildCoordinate } from 'shared/parcel'

export function isParcelPendingTransaction(parcel, tx) {
  return (
    tx.status === txUtils.TRANSACTION_STATUS.pending &&
    buildCoordinate(tx.payload.x, tx.payload.y) === parcel.id
  )
}
