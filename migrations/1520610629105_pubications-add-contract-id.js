import { Publication } from '../src/Listing'

exports.up = pgm => {
  const tableName = Publication.tableName

  pgm.addColumns(tableName, {
    contract_id: {
      type: 'TEXT',
      notNull: true,
      unique: true
    }
  })

  pgm.createIndex(tableName, 'contract_id')
}
