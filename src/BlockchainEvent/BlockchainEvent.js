import { Model } from 'decentraland-commons'

export class BlockchainEvent extends Model {
  static tableName = 'blockchain_events'
  static columnNames = ['tx_hash', 'name', 'block_number', 'log_index', 'args']
  static primaryKey = 'tx_hash'

  static EVENTS = {
    publicationCreated: 'AuctionCreated',
    publicationSuccessful: 'AuctionSuccessful',
    publicationCancelled: 'AuctionCancelled',
    parcelTransfer: 'Transfer',
    parcelUpdate: 'Update'
  }

  static findLast() {
    return this.findOne(null, { block_number: 'DESC', log_index: 'DESC' })
  }

  static findFrom(blockNumber) {
    return this.db.query(
      `SELECT *
        FROM ${this.tableName}
        WHERE block_number >= $1
        ORDER BY block_number, log_index ASC`,
      [blockNumber]
    )
  }
}
