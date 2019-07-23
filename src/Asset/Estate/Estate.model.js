import { Model } from 'decentraland-server'

import { EstateQueries } from './Estate.queries'
import { Asset } from '../Asset'
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

  static async findById(id) {
    return new Asset(this).findById(id)
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

  static findApprovals(id) {
    return new Asset(this).findApprovals(id)
  }

  static findBlockchainEvents(estateId, fromBlock) {
    return Estate.query(
      SQL`SELECT *
        FROM ${SQL.raw(BlockchainEvent.tableName)}
        WHERE (${EstateQueries.areEstateEvents(estateId)})
        AND ${BlockchainEventQueries.fromBlock(fromBlock)}
        ORDER BY block_number ASC, log_index ASC`
    )
  }

  static deleteBlockchainEvents(estateId, fromBlock) {
    return Estate.query(
      SQL`DELETE FROM ${SQL.raw(BlockchainEvent.tableName)}
        WHERE (${EstateQueries.areEstateEvents(estateId)})
        AND ${BlockchainEventQueries.fromBlock(fromBlock)}`
    )
  }

  static async updateDistrictIds() {
    return this.query(
      SQL`UPDATE ${SQL.raw(this.tableName)}
      SET district_id = P.district_id
        FROM parcels as P
        WHERE ${SQL.raw(this.tableName)}.id = P.estate_id AND
        P.estate_id IS NOT NULL AND
        P.district_id IS NOT NULL;`
    )
  }
}
