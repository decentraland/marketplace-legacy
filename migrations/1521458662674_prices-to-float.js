import { Publication } from '../src/Publication'
import { Parcel } from '../src/Asset'

exports.up = pgm => {
  pgm.alterColumn(Publication.tableName, 'price', {
    type: 'FLOAT',
    using: 'price::float'
  })
  pgm.alterColumn(Parcel.tableName, 'auction_price', {
    type: 'FLOAT',
    using: 'auction_price::float'
  })
}

exports.down = pgm => {
  pgm.alterColumn(Publication.tableName, 'price', { type: 'TEXT' })
  pgm.alterColumn(Parcel.tableName, 'auction_price', { type: 'TEXT' })
}
