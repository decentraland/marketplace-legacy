import { Parcel } from '../src/Asset'

exports.up = pgm => {
  const tableName = Parcel.tableName

  pgm.addColumns(tableName, {
    in_estate: { type: 'BOOLEAN', default: false, allowNull: false }
  })
}
