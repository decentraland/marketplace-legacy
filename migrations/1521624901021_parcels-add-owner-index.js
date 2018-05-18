const { Parcel } = require('../src/Asset')

exports.up = pgm => {
  const tableName = Parcel.tableName
  pgm.createIndex(tableName, 'owner')
}
