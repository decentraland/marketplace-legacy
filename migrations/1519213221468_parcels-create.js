import { Parcel } from '../src/Parcel'

const tableName = Parcel.tableName

exports.up = pgm => {
  pgm.createTable(
    tableName,
    {
      id: { type: 'TEXT', primaryKey: true, notNull: true },
      x: { type: 'TEXT', notNull: true },
      y: { type: 'TEXT', notNull: true },
      price: 'TEXT',
      district_id: 'TEXT',
      created_at: { type: 'TIMESTAMP', notNull: true},
      updated_at: 'TIMESTAMP'
    },
    { ifNotExists: true }
  )

  pgm.createIndex(tableName, ['x', 'y'], { name: 'parcels_x_y_idx' })
}

exports.down = pgm => {
  pgm.dropTable(tableName)

  pgm.dropIndex(tableName, ['x', 'y'], { name: 'parcels_x_y_idx' })
}
