const { Parcel } = require('../src/Parcel')

exports.up = pgm => {
  const tableName = Parcel.tableName
  pgm.createIndex(tableName, 'owner')
}
