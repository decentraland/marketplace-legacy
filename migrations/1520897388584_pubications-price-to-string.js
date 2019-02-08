import { Publication } from '../src/Listing'

const tableName = Publication.tableName

exports.up = pgm => {
  pgm.alterColumn(tableName, 'price', { type: 'TEXT' })
}

exports.down = pgm => {
  pgm.alterColumn(tableName, 'price', { type: 'DECIMAL' })
}
