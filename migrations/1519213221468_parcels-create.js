import { Parcel } from '../src/Asset'

const tableName = Parcel.tableName

exports.up = pgm => {
  pgm.createTable(
    tableName,
    {
      id: { type: 'TEXT', primaryKey: true, notNull: true },
      x: { type: 'INT', notNull: true },
      y: { type: 'INT', notNull: true },
      price: 'TEXT',
      district_id: 'TEXT',
      created_at: { type: 'TIMESTAMP', notNull: true },
      updated_at: 'TIMESTAMP'
    },
    { ifNotExists: true }
  )

  pgm.createIndex(tableName, ['x', 'y'], { name: 'parcels_x_y_idx' })
}

exports.down = pgm => {
  pgm.dropIndex(tableName, ['x', 'y'], { name: 'parcels_x_y_idx' })

  pgm.dropTable(tableName)
}
