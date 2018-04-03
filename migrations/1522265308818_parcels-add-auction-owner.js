import { Parcel } from '../src/Parcel'

exports.up = pgm => {
  const tableName = Parcel.tableName

  pgm.addColumns(tableName, {
    auction_owner: {
      type: 'TEXT',
      default: null
    }
  })
}
