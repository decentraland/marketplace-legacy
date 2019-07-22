import { Tile } from '../src/Tile'

const tableName = Tile.tableName

exports.up = pgm => {
  pgm.addColumns(tableName, {
    approvals: { type: 'text[]' }
  })

  pgm.createIndex(tableName, 'approvals')
}
