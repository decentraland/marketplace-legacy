const { Publication } = require('../src/Publication')

const tableName = Publication.tableName

exports.up = pgm => {
  pgm.dropIndex(tableName, 'address', {
    name: 'publications_address_idx',
    ifExists: true
  })

  pgm.createIndex(tableName, 'tx_status')
  pgm.createIndex(tableName, 'status')
  pgm.createIndex(tableName, 'owner')
}

exports.down = pgm => {
  pgm.createIndex(tableName, 'address', {
    name: 'publications_address_idx',
    ifNotExists: true
  })

  pgm.dropIndex(tableName, 'tx_status')
  pgm.dropIndex(tableName, 'status')
  pgm.dropIndex(tableName, 'owner')
}
