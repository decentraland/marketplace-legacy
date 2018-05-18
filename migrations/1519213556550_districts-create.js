const { District } = require('../src/District')

const tableName = District.tableName

exports.up = pgm => {
  pgm.createTable(
    tableName,
    {
      id: { type: 'TEXT', primaryKey: true, notNull: true },
      name: 'TEXT',
      description: 'TEXT',
      link: 'TEXT',
      public: {
        type: 'BOOLEAN',
        notNull: true,
        default: true
      },
      parcel_count: 'DECIMAL',
      parcel_ids: 'TEXT[]',
      priority: 'INT',
      center: 'TEXT',
      disabled: {
        type: 'BOOLEAN',
        notNull: true,
        default: false
      },
      created_at: { type: 'TIMESTAMP', notNull: true },
      updated_at: 'TIMESTAMP'
    },
    { ifNotExists: true }
  )

  pgm.createIndex(tableName, 'disabled')
  pgm.createIndex(tableName, 'name')
}

exports.down = pgm => {
  pgm.dropIndex(tableName, 'disabled')
  pgm.dropIndex(tableName, 'name')

  pgm.dropTable(tableName)
}
