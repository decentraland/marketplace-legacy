import { isPending } from '@dapps/modules/transaction/utils'
import { isParcel } from 'shared/parcel'
import { buildCoordinate } from 'shared/coordinates'

export function isAssetPendingTransaction(asset, tx) {
  if (!asset) return false

  const payloadAssetId = isParcel(asset)
    ? buildCoordinate(tx.payload.x, tx.payload.y)
    : tx.payload.id

  return isPending(tx.status) && asset && payloadAssetId === asset.id
}
