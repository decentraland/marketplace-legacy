import { env } from 'decentraland-commons'

import { Parcel } from '../Parcel'
import { SQL, raw } from '../../database'
import { ASSET_TYPES } from '../../../shared/asset'
import { BlockchainEventQueries } from '../../BlockchainEvent'

export const EstateQueries = Object.freeze({
  // prettier-ignore
  estateHasParcels: (tableRef) =>
    SQL`(${raw(tableRef)}.asset_type = ${ASSET_TYPES.estate}
    AND EXISTS(SELECT 1 FROM ${raw(Parcel.tableName)} AS p WHERE p.estate_id = ${raw(tableRef)}.asset_id)
    OR ${raw(tableRef)}.asset_type != ${ASSET_TYPES.estate})`,
  areEstateEvents: estateId => {
    const address = env.get('ESTATE_REGISTRY_CONTRACT_ADDRESS').toLowerCase()
    // prettier-ignore
    return SQL`${BlockchainEventQueries.byArgs('_estateId', estateId)}
    OR ${BlockchainEventQueries.byArgs('assetId', estateId)}
    OR ((${BlockchainEventQueries.byArgs('_tokenId', estateId)} OR ${BlockchainEventQueries.byArgs('_assetId', estateId)})
      AND address = ${address})
    OR (${BlockchainEventQueries.byArgs('_tokenId', estateId)} AND ${BlockchainEventQueries.byArgs('_tokenAddress', address)})`
  }
})
