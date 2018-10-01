import { Parcel } from '../src/Asset'

exports.up = pgm => {
  const tableName = Parcel.tableName

  pgm.addColumns(tableName, {
    auction_owner: {
      type: 'TEXT',
      default: null
    }
  })
}
