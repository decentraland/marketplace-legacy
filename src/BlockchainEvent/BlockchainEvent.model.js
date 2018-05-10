import {
  db,
  queryDatabase,
  QueryBuilder,
  QueryTypes,
  ColumnTypes,
  Op
} from '../database'
import { Publication } from '../Publication'

const EVENTS = {
  publicationCreated: 'AuctionCreated',
  publicationSuccessful: 'AuctionSuccessful',
  publicationCancelled: 'AuctionCancelled',
  parcelTransfer: 'Transfer',
  parcelUpdate: 'Update'
}

export const BlockchainEvent = db.define('blockchain_event', {
  tx_hash: { type: ColumnTypes.TEXT, primaryKey: true },
  log_index: { type: ColumnTypes.INTEGER, primaryKey: true },
  block_number: { type: ColumnTypes.INTEGER, allowNull: false },
  name: {
    type: ColumnTypes.TEXT,
    allowNull: false,
    validate: {
      isIn: [Object.values(EVENTS)]
    }
  },
  args: ColumnTypes.JSON
})

BlockchainEvent.EVENTS = EVENTS

Object.assign(BlockchainEvent, {
  afterConnect() {
    BlockchainEvent.hasMany(Publication, { foreignKey: 'tx_hash' })
  },
  async createWithoutConflicts(attributes) {
    const sql = QueryBuilder.buildInsertSQL(BlockchainEvent, {
      created_at: new Date(),
      updated_at: new Date(),
      ...attributes
    })

    return queryDatabase(
      `${sql} ON CONFLICT (tx_hash, log_index) DO NOTHING;`,
      { type: QueryTypes.INSERT }
    )
  },
  async findLastBlockNumber() {
    const { block_number } = await this.findOne({
      attributes: ['block_number'],
      order: [['block_number', 'DESC'], ['log_index', 'DESC']]
    })
    return block_number
  },
  findFrom(blockNumber) {
    return this.findAll({
      where: {
        block_number: { [Op.gt]: blockNumber }
      },
      order: [['block_number', 'ASC'], ['log_index', 'ASC']]
    })
  },
  findByAssetId(assetId) {
    return this.findAll({
      where: { args: { assetId } },
      order: [['block_number', 'DESC'], ['log_index', 'DESC']]
    })
  }
})
