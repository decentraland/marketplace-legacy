import { Publication } from '../src/Publication'

const tableName = Publication.tableName

exports.up = pgm => {
  pgm.dropColumns(tableName, ['x', 'y'])

  pgm.addColumns(tableName, {
    type: {
      type: 'TEXT',
      default: Publication.TYPES.parcel,
      notNull: true
    },
    asset_id: {
      type: 'TEXT',
      notNull: true
    },
    marketplace_id: {
      type: 'TEXT',
      notNull: true
    }
  })
  pgm.addIndex(tableName, 'asset_id')
}

exports.down = pgm => {
  pgm.addColumns(tableName, {
    x: { type: 'INT' },
    y: { type: 'INT' }
  })

  pgm.dropColumns(tableName, ['type', 'asset_id', 'marketplace_id'])
  pgm.dropIndex(tableName, 'asset_id', { ifExists: true })
}
