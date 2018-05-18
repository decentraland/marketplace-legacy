const { Parcel } = require('../src/Asset')

exports.up = pgm => {
  pgm.renameColumn(Parcel.tableName, 'price', 'auction_price')
}
