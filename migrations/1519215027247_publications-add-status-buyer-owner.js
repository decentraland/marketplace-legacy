const { Publication } = require('../src/Publication')

exports.up = pgm => {
  const tableName = Publication.tableName

  const publicationStatus = Object.values(Publication.STATUS)
    .map(val => `'${val}'`)
    .join(', ')

  pgm.addColumns(tableName, {
    status: {
      type: 'TEXT',
      notNull: true,
      default: Publication.STATUS.open,
      check: `status IN (${publicationStatus})`
    },
    buyer: {
      type: 'VARCHAR(42)'
    }
  })

  pgm.renameColumn(tableName, 'address', 'owner')
}
