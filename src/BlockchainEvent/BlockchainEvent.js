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

  static async findLastBlockNumber() {
    const { block_number } = await this.findOne(null, {
      block_number: 'DESC',
      log_index: 'DESC'
    })
    return block_number
  }

  static findLastest(limit = 10) {
    const MAX_RESULT_COUNT = 10000

    limit = parseInt(limit, 10) <= MAX_RESULT_COUNT ? limit : 10

    return this.find(
      null,
      { block_number: 'DESC', log_index: 'DESC' },
      `LIMIT ${limit}`
    )
  }

  static findFrom(blockNumber) {
    return this.db.query(
      `SELECT *
        FROM ${this.tableName}
        WHERE block_number > $1
        ORDER BY block_number ASC, log_index ASC`,
      [blockNumber]
    )
  }

  static findByAssetId(assetId) {
    return this.db.query(
      `SELECT *
        FROM ${this.tableName}
        WHERE args->>'assetId' = $1
        ORDER BY block_number DESC, log_index DESC`,
      [assetId]
    )
  }
}
