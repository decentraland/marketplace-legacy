import { txUtils } from 'decentraland-commons'
import { Publication } from '../src/Publication'

const tableName = Publication.tableName

exports.up = pgm => {
  pgm.createTable(
    tableName,
    {
      tx_hash: { type: 'TEXT', primaryKey: true, unique: true, notNull: true },
      tx_status: {
        type: 'TEXT',
        notNull: true,
        default: txUtils.TRANSACTION_STATUS.pending
      },
      x: { type: 'INT', notNull: true },
      y: { type: 'INT', notNull: true },
      address: { type: 'VARCHAR(42)', notNull: true },
      price: { type: 'DECIMAL', notNull: true },
      is_sold: { type: 'BOOLEAN', notNull: true, default: false },
      expires_at: 'BIGINT',
      created_at: { type: 'TIMESTAMP', notNull: true },
      updated_at: 'TIMESTAMP'
    },
    { ifNotExists: true }
  )

  pgm.createIndex(tableName, 'address')
}

exports.down = pgm => {
  pgm.dropIndex(tableName, 'address')

  pgm.dropTable(tableName)
}
