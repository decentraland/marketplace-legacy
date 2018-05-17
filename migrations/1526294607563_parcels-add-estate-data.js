import { Parcel } from '../src/Parcel'

exports.up = pgm => {
  const tableName = Parcel.tableName

  pgm.addColumns(tableName, {
    in_estate: { type: 'BOOLEAN', default: false, allowNull: false }
  })
}
