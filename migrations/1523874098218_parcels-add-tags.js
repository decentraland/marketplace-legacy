const { Parcel } = require('../src/Parcel')

exports.up = pgm => {
  const tableName = Parcel.tableName

  pgm.addColumns(tableName, {
    tags: {
      type: 'JSON',
      default: '{}'
    }
  })
}
