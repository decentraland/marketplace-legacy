import { Model } from 'decentraland-commons'
import { BlockchainEventQueries } from './BlockchainEvent.queries'
import { SQL } from '../database'

export class BlockchainEvent extends Model {
  static tableName = 'blockchain_events'
  static primaryKey = 'tx_hash'
  static columnNames = [
    'tx_hash',
    'name',
    'block_number',
    'log_index',
    'args',
    'address'
  ]

  static async insertWithoutConflicts(blockchainEvent) {
    const now = new Date()

    blockchainEvent.created_at = now
    blockchainEvent.updated_at = now

    const values = Object.values(blockchainEvent)

    return this.db.query(
      `INSERT INTO ${this.tableName}(
       ${this.db.toColumnFields(blockchainEvent)}
      ) VALUES(
       ${this.db.toValuePlaceholders(blockchainEvent)}
      ) ON CONFLICT (tx_hash, log_index) DO NOTHING;`,
      values
    )
  }

  static async findLastBlockNumber() {
    const blockchainEvent = await this.findOne(null, {
      block_number: 'DESC',
      log_index: 'DESC'
    })

    return blockchainEvent ? blockchainEvent.block_number : 0
  }

  static findFrom(blockNumber) {
    return this.db.query(
      SQL`SELECT *
        FROM ${SQL.raw(this.tableName)}
        WHERE block_number > ${blockNumber}
        ORDER BY block_number ASC, log_index ASC`
    )
  }

  static findByArgs(argName, argValue) {
    return this.db.query(
      SQL`SELECT *
        FROM ${SQL.raw(this.tableName)}
        WHERE ${BlockchainEventQueries.byArgs(argName, argValue)}
        ORDER BY block_number ASC, log_index ASC`
    )
  }

  static findByAnyArgs(argNames, argValue) {
    if (!Array.isArray(argNames)) {
      throw new Error('First argument must be an array')
    }
    return this.db.query(
      SQL`SELECT *
        FROM ${SQL.raw(this.tableName)}
        WHERE ${BlockchainEventQueries.byAnyArgs(argNames, argValue)}
        ORDER BY block_number ASC, log_index ASC`
    )
  }

  static deleteByArgs(argName, argValue) {
    return this.db.query(
      SQL`DELETE FROM ${SQL.raw(this.tableName)}
        WHERE ${BlockchainEventQueries.byArgs(argName, argValue)}`
    )
  }

  static getEventName(event) {
    return event.split('-')[1]
  }
}
