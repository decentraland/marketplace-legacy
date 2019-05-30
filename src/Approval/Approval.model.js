import { Model } from 'decentraland-server'
import { env } from 'decentraland-commons'

import { SQL } from '../database'
import { BlockchainEvent, BlockchainEventQueries } from '../BlockchainEvent'
import { eventNames } from '../../src/ethereum'

export class Approval extends Model {
  static tableName = 'approvals'
  static primaryKey = ''
  static columnNames = ['type', 'token_address', 'owner', 'operator']
  static withTimestamps = false

  static deleteManaApprovalEvents(fromBlock) {
    const address = env.get('MANA_TOKEN_CONTRACT_ADDRESS').toLowerCase()

    return Approval.query(
      SQL`DELETE FROM ${SQL.raw(BlockchainEvent.tableName)}
        WHERE ${BlockchainEventQueries.byAddress(
          address
        )} AND ${BlockchainEventQueries.byEventName(eventNames.Approval)}
        AND ${BlockchainEventQueries.fromBlock(fromBlock)}`
    )
  }
}
