import { Contribution } from '../src/Contribution'

const tableName = Contribution.tableName

exports.up = pgm => {
  pgm.createTable(
    tableName,
    {
      id: {
        type: 'SERIAL',
        notNull: true,
        primaryKey: true
      },
      address: { type: 'VARCHAR(42)', notNull: true },
      district_id: { type: 'VARCHAR(36)', notNull: true },
      land_count: { type: 'INT', notNull: true },
      timestamp: { type: 'VARCHAR(20)', notNull: true },
      message: { type: 'BYTEA' },
      signature: { type: 'BYTEA' },
      created_at: { type: 'TIMESTAMP', notNull: true },
      updated_at: 'TIMESTAMP'
    },
    { ifNotExists: true }
  )

  pgm.createIndex(tableName, 'address')
  pgm.createIndex(tableName, 'district_id')
}

exports.down = pgm => {
  pgm.dropTable(tableName)

  pgm.dropIndex(tableName, 'address')
  pgm.dropIndex(tableName, 'district_id')
}
