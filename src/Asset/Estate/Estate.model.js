import { env, Model } from 'decentraland-commons'

import { Asset } from '../Asset'
import { Parcel } from '../Parcel'
import { BlockchainEvent, BlockchainEventQueries } from '../../BlockchainEvent'
import { SQL } from '../../database'

export class Estate extends Model {
  static tableName = 'estates'
  static columnNames = [
    'id',
    'tx_hash',
    'token_id',
    'district_id',
    'owner',
    'operator',
    'update_operator',
    'data',
    'last_transferred_at'
  ]

  static findWithParcels() {
    return this.db.query(
      SQL`SELECT e.*, array_to_json(array_agg(p.*)) as parcels
        FROM ${SQL.raw(this.tableName)} as e
        JOIN ${SQL.raw(Parcel.tableName)} as p ON e.id = p.estate_id
        GROUP BY e.id`
    )
  }

  static findByOwner(owner) {
    return new Asset(this).findByOwner(owner)
  }

  static findByOwnerAndStatus(owner, status) {
    return new Asset(this).findByOwnerAndStatus(owner, status)
  }

  static findByTokenId(tokenId) {
    return new Asset(this).findByTokenId(tokenId)
  }

  static findByTokenIds(tokenIds) {
    return new Asset(this).findByTokenIds(tokenIds)
  }

  static findBlockchainEvents(estateId) {
    const address = env.get('ESTATE_REGISTRY_CONTRACT_ADDRESS')

    // prettier-ignore
    return Estate.query(
      SQL`SELECT *
        FROM ${SQL.raw(BlockchainEvent.tableName)}
        WHERE ${BlockchainEventQueries.byArgs('_estateId', estateId)}
          OR (${BlockchainEventQueries.byArgs('_tokenId', estateId)} AND address = ${address})
          OR (${BlockchainEventQueries.byArgs('_tokenId', estateId)} AND ${BlockchainEventQueries.byArgs('_tokenAddress', address)})
        ORDER BY block_number ASC, log_index ASC`)
  }

  static deleteBlockchainEvents(estateId) {
    const address = env.get('ESTATE_REGISTRY_CONTRACT_ADDRESS')

    // prettier-ignore
    return Estate.query(
      SQL`DELETE FROM ${SQL.raw(BlockchainEvent.tableName)}
        WHERE ${BlockchainEventQueries.byArgs('_estateId', estateId)}
        OR (${BlockchainEventQueries.byArgs('_tokenId', estateId)} AND address = ${address})
        OR (${BlockchainEventQueries.byArgs('_tokenId', estateId)} AND ${BlockchainEventQueries.byArgs('_tokenAddress', address)})`)
  }

  static async updateDistrictIds() {
    return this.db.query(
      SQL`UPDATE ${SQL.raw(this.tableName)} 
      SET district_id = P.district_id
        FROM parcels as P 
        WHERE ${SQL.raw(this.tableName)}.id = P.estate_id AND 
        P.estate_id IS NOT NULL AND 
        P.district_id IS NOT NULL;`
    )
  }
}
