import { Model } from 'decentraland-commons'
import { SQL } from '../database'

export interface BlockchainEventAttributes {
  tx_hash: string
  name: string
  block_number: number
  log_index: number
  args: object
  created_at?: Date
  updated_at?: Date
}

export class BlockchainEvent extends Model {
  static tableName = 'blockchain_events'
  static primaryKey = 'tx_hash'
  static columnNames = ['tx_hash', 'name', 'block_number', 'log_index', 'args']

  static EVENTS = Object.freeze({
    publicationCreated: 'AuctionCreated',
    publicationSuccessful: 'AuctionSuccessful',
    publicationCancelled: 'AuctionCancelled',
    parcelTransfer: 'Transfer',
    parcelUpdate: 'Update'
  })

  static async insertWithoutConflicts(
    blockchainEvent: BlockchainEventAttributes
  ) {
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

  static async findLastBlockNumber(): Promise<number> {
    const { block_number } = await this.findOne(null, {
      block_number: 'DESC',
      log_index: 'DESC'
    })
    return block_number
  }

  static findFrom(blockNumber: number) {
    return this.db.query(SQL`SELECT *
        FROM ${SQL.raw(this.tableName)}
        WHERE block_number > ${blockNumber}
        ORDER BY block_number ASC, log_index ASC`)
  }

  static findByAssetId(assetId: string) {
    return this.db.query(SQL`SELECT *
        FROM ${SQL.raw(this.tableName)}
        WHERE args->>'assetId' = ${assetId}
        ORDER BY block_number DESC, log_index DESC`)
  }
}
