import { Parcel } from '../src/Parcel'

exports.up = pgm => {
  const tableName = Parcel.tableName

  pgm.addColumns(tableName, {
    in_state: { type: 'BOOLEAN', default: false, allowNull: false }
  })
}
