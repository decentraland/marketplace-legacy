import { Publication } from '../src/Listing'

const tableName = Publication.tableName

exports.up = pgm => {
  pgm.dropColumn(tableName, 'is_sold', { ifExists: true })
}

exports.down = pgm => {
  pgm.addColumns(tableName, {
    status: {
      type: 'BOOLEAN',
      notNull: true,
      default: false
    }
  })
}
