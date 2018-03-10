import { Model } from 'decentraland-commons'

export class BlockchainEvent extends Model {
  static tableName = 'blockchain_events'
  static columnNames = ['tx_hash', 'name', 'block_number', 'args']
  static primaryKey = 'tx_hash'

  static findLast() {
    return this.findOne(null, { block_number: 'DESC' })
  }

  static findFrom(blockNumber) {
    return this.db.query(
      `SELECT *
        FROM ${this.tableName}
        WHERE block_number >= $1
        ORDER BY block_number ASC`,
      [blockNumber]
    )
  }
}
