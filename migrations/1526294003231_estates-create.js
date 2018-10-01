import { Estate } from '../src/Asset'

const tableName = Estate.tableName

exports.up = pgm => {
  pgm.createTable(
    tableName,
    {
      id: { type: 'TEXT', primaryKey: true, notNull: true },
      owner: { type: 'TEXT', notNull: true },
      data: 'JSON',
      last_transferred_at: 'BIGINT',
      created_at: { type: 'TIMESTAMP', notNull: true },
      updated_at: 'TIMESTAMP'
    },
    { ifNotExists: true }
  )
}

exports.down = pgm => {
  pgm.dropTable(tableName)
}
