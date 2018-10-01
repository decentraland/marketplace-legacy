import { Parcel } from '../src/Asset'

exports.up = pgm => {
  pgm.renameColumn(Parcel.tableName, 'price', 'auction_price')
}
