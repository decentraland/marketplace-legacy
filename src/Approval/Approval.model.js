import { Model } from 'decentraland-server'

import { ApprovalQueries } from './Approval.queries'
import { SQL } from '../database'
import { BlockchainEvent, BlockchainEventQueries } from '/../BlockchainEvent'

export class Approval extends Model {
  static tableName = 'approvals'
  static primaryKey = ''
  static columnNames = ['type', 'token_address', 'owner', 'operator']
  static withTimestamps = false

  static deleteManaApprovalEvents(fromBlock) {
    return Approval.query(
      SQL`DELETE FROM ${SQL.raw(BlockchainEvent.tableName)}
        WHERE (${ApprovalQueries.areManaEvents()})
        AND ${BlockchainEventQueries.fromBlock(fromBlock)}`
    )
  }
}
