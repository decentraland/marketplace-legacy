import { Atlas } from '../src/Map'

const tableName = Atlas.tableName

exports.up = pgm => {
  pgm.createTable(
    tableName,
    {
      id: { type: 'TEXT', primaryKey: true, notNull: true },
      x: { type: 'INT', notNull: true },
      y: { type: 'INT', notNull: true },
      district_id: 'TEXT',
      owner: 'TEXT',
      price: 'DECIMAL',
      name: 'TEXT',
      type: { type: 'TEXT', notNull: true },
      color: { type: 'TEXT', notNull: true },
      in_estate: { type: 'BOOLEAN', default: false, notNull: true },
      is_connected_left: { type: 'BOOLEAN', default: false, notNull: true },
      is_connected_top: { type: 'BOOLEAN', default: false, notNull: true },
      is_connected_topleft: { type: 'BOOLEAN', default: false, notNull: true },
      created_at: { type: 'TIMESTAMP', notNull: true },
      updated_at: 'TIMESTAMP'
    },
    { ifNotExists: true }
  )
}

exports.down = pgm => {
  pgm.dropTable(tableName)
}
