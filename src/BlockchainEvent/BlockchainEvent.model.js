import { Model } from 'decentraland-commons'
import { SQL } from '../database'

export class BlockchainEvent extends Model {
  static tableName = 'blockchain_events'
  static primaryKey = 'tx_hash'
  static columnNames = ['tx_hash', 'name', 'block_number', 'log_index', 'args']

  static EVENTS = {
    publicationCreated: 'AuctionCreated',
    publicationSuccessful: 'AuctionSuccessful',
    publicationCancelled: 'AuctionCancelled',
    parcelTransfer: 'Transfer',
    parcelUpdate: 'Update',
    newMortgage: 'NewMortgage',
    cancelledMortgage: 'CanceledMortgage',
    startedMortgage: 'StartedMortgage',
    paidMortgage: 'PaidMortgage',
    defaultedMortgage: 'DefaultedMortgage',
    partialPayment: 'PartialPayment,'
  }

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
    const { block_number } = await this.findOne(null, {
      block_number: 'DESC',
      log_index: 'DESC'
    })
    return block_number
  }

  static findFrom(blockNumber) {
    return this.db.query(
      SQL`SELECT *
        FROM ${SQL.raw(this.tableName)}
        WHERE block_number > ${blockNumber}
        ORDER BY block_number ASC, log_index ASC`
    )
  }

  static findByAssetId(assetId) {
    return this.db.query(
      SQL`SELECT *
        FROM ${SQL.raw(this.tableName)}
        WHERE args->>'assetId' = ${assetId}
        ORDER BY block_number DESC, log_index DESC`
    )
  }
}
