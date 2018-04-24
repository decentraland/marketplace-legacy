import { BlockTimestamp } from '../src/BlockTimestamp'

const tableName = BlockTimestamp.tableName

exports.up = pgm => {
  pgm.createTable(
    tableName,
    {
      block_number: { type: 'BIGINT', primaryKey: true, notNull: true },
      timestamp: { type: 'BIGINT', notNull: true },
      created_at: { type: 'TIMESTAMP', notNull: true },
      updated_at: 'TIMESTAMP'
    },
    { ifNotExists: true }
  )
}

exports.down = pgm => {
  pgm.dropTable(tableName)
}
