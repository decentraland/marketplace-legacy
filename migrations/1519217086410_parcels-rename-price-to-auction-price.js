const { Parcel } = require('../src/Parcel')

exports.up = pgm => {
  pgm.renameColumn(Parcel.tableName, 'price', 'auction_price')
}
