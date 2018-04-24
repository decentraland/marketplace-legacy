import { txUtils } from 'decentraland-eth'
import { buildCoordinate } from 'lib/utils'

export function isParcelPendingTransaction(parcel, tx) {
  return (
    tx.status === txUtils.TRANSACTION_STATUS.pending &&
    buildCoordinate(tx.payload.x, tx.payload.y) === parcel.id
  )
}
