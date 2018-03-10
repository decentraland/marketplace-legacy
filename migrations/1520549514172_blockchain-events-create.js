import { BlockchainEvent } from '../src/BlockchainEvent'

const tableName = BlockchainEvent.tableName

exports.up = pgm => {
  pgm.createTable(
    tableName,
    {
      tx_hash: { type: 'TEXT', primaryKey: true, notNull: true },
      name: { type: 'TEXT', primaryKey: true },
      block_number: 'BIGINT',
      args: 'JSON',
      created_at: { type: 'TIMESTAMP', notNull: true },
      updated_at: 'TIMESTAMP'
    },
    { ifNotExists: true, primaryKey: ['tx_hash', 'name'] }
  )

  pgm.createIndex(tableName, 'block_number')
}

exports.down = pgm => {
  pgm.dropIndex(tableName, 'block_number')

  pgm.dropTable(tableName)
}
