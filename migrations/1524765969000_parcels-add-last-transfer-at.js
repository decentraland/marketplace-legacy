import { Parcel } from '../src/Asset'

exports.up = pgm => {
  const tableName = Parcel.tableName

  pgm.addColumns(tableName, {
    last_transferred_at: { type: 'BIGINT' }
  })
}
