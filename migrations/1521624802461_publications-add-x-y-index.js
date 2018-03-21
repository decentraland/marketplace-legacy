import { Publication } from '../src/Publication'

exports.up = pgm => {
  const tableName = Publication.tableName
  pgm.createIndex(tableName, ['x', 'y'])
}
