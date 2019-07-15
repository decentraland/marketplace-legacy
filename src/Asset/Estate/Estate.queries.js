import { env } from 'decentraland-commons'

import { Parcel } from '../Parcel'
import { SQL, raw } from '../../database'
import { ASSET_TYPES } from '../../../shared/asset'
import { BlockchainEventQueries } from '../../BlockchainEvent'

export const EstateQueries = Object.freeze({
  estateHasParcels: tableRef =>
    // prettier-ignore
    SQL`(
      ${raw(tableRef)}.asset_type = ${ASSET_TYPES.estate}
      AND EXISTS(SELECT 1 FROM ${raw(Parcel.tableName)} AS p WHERE p.estate_id = ${raw(tableRef)}.asset_id LIMIT 1)
      OR ${raw(tableRef)}.asset_type != ${ASSET_TYPES.estate}
    )`,

  areEstateEvents: estateId => {
    const address = env.get('ESTATE_REGISTRY_CONTRACT_ADDRESS').toLowerCase()
    const byArgs = BlockchainEventQueries.byArgs()

    // prettier-ignore
    return SQL`${byArgs('_estateId', estateId)}
      OR ${byArgs('assetId', estateId)}
      OR (
        (${byArgs('_tokenId', estateId)} OR ${byArgs('_assetId', estateId)})
        AND address = ${address}
      )
      OR (${byArgs('_tokenId', estateId)} AND ${byArgs('_tokenAddress', address)})`
  }
})
