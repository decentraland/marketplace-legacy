import { Publication } from '../src/Publication'

exports.up = pgm => {
  const tableName = Publication.tableName

  pgm.addColumns(tableName, {
    block_number: {
      type: 'INT',
      notNull: true
    }
  })
}
