import { BlockchainEvent } from '../src/BlockchainEvent'

const tableName = BlockchainEvent.tableName

exports.up = pgm => {
  pgm.createTable(
    tableName,
    {
      tx_hash: { type: 'TEXT', primaryKey: true, unique: true, notNull: true },
      name: 'TEXT',
      block_number: 'BIGINT',
      args: 'json',
      created_at: { type: 'TIMESTAMP', notNull: true },
      updated_at: 'TIMESTAMP'
    },
    { ifNotExists: true }
  )

  pgm.createIndex(tableName, 'block_number')
}

exports.down = pgm => {
  pgm.dropIndex(tableName, 'block_number')

  pgm.dropTable(tableName)
}
