import { Atlas } from '../src/Map'
import { ASSET_TYPES } from '../shared/asset'

const tableName = Atlas.tableName

exports.up = pgm => {
  pgm.createTable(
    tableName,
    {
      id: { type: 'TEXT', primaryKey: true, notNull: true },
      x: { type: 'INT', notNull: true },
      y: { type: 'INT', notNull: true },
      estate_id: 'TEXT',
      district_id: 'TEXT',
      owner: 'TEXT',
      price: 'DECIMAL',
      label: 'TEXT',
      type: { type: 'TEXT', notNull: true },
      color: { type: 'TEXT', notNull: true },
      asset_type: { type: 'TEXT', default: ASSET_TYPES.parcel, notNull: true },
      is_connected_left: { type: 'INT1', default: false, notNull: true },
      is_connected_top: { type: 'INT1', default: false, notNull: true },
      is_connected_topleft: { type: 'INT1', default: false, notNull: true },
      created_at: { type: 'TIMESTAMP', notNull: true },
      updated_at: 'TIMESTAMP'
    },
    { ifNotExists: true }
  )

  pgm.createIndex(tableName, ['x', 'y'], { unique: true })
  pgm.createIndex(tableName, 'owner')
  pgm.createIndex(tableName, 'district_id')
}

exports.down = pgm => {
  pgm.dropTable(tableName)
}
