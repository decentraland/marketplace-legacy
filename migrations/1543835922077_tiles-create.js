import { Tile } from '../src/Tile'
import { ASSET_TYPES } from '../shared/asset'

const tableName = Tile.tableName

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
      expires_at: 'BIGINT',
      name: 'TEXT',
      type: { type: 'SMALLINT', notNull: true },
      asset_type: { type: 'TEXT', default: ASSET_TYPES.parcel, notNull: true },
      is_connected_left: { type: 'SMALLINT', default: 0, notNull: true },
      is_connected_top: { type: 'SMALLINT', default: 0, notNull: true },
      is_connected_topleft: { type: 'SMALLINT', default: 0, notNull: true },
      created_at: { type: 'TIMESTAMP', notNull: true },
      updated_at: 'TIMESTAMP'
    },
    { ifNotExists: true }
  )

  pgm.createIndex(tableName, ['x', 'y'], { unique: true })
  pgm.createIndex(tableName, 'owner')
  pgm.createIndex(tableName, 'district_id')
  pgm.createIndex(tableName, 'type')
  pgm.createIndex(tableName, 'updated_at')
  pgm.createIndex(tableName, 'expires_at')
}

exports.down = pgm => {
  pgm.dropTable(tableName)
}
