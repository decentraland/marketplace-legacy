import { Publication } from '../src/Listing'

exports.up = pgm => {
  const tableName = Publication.tableName
  pgm.createIndex(tableName, ['x', 'y'])
}
