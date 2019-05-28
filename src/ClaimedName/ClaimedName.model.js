import { Model } from 'decentraland-server'

import { ClaimNameQueries } from './ClaimName.queries'
import { SQL } from '../database'
import { BlockchainEvent, BlockchainEventQueries } from '../BlockchainEvent'

export class ClaimedName extends Model {
  static tableName = 'claimed_names'
  static primaryKey = ''
  static columnNames = ['owner', 'username', 'metadata']
  static withTimestamps = false

  static findBlockchainEvents(owner, fromBlock) {
    return ClaimedName.query(
      SQL`SELECT *
        FROM ${SQL.raw(BlockchainEvent.tableName)}
        WHERE (${ClaimNameQueries.areClaimNameEvents(owner)})
        AND ${BlockchainEventQueries.fromBlock(fromBlock)}
        ORDER BY block_number ASC, log_index ASC`
    )
  }

  static deleteBlockchainEvents(owner, fromBlock) {
    return ClaimedName.query(
      SQL`DELETE FROM ${SQL.raw(BlockchainEvent.tableName)}
        WHERE (${ClaimNameQueries.areClaimNameEvents(owner)})
        AND ${BlockchainEventQueries.fromBlock(fromBlock)}`
    )
  }
}
