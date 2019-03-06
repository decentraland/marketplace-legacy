import { Parcel, Estate } from '../src/Asset'

const estateTableName = Estate.tableName
const parcelTableName = Parcel.tableName

exports.up = pgm => {
  pgm.addColumns(estateTableName, {
    operator: { type: 'TEXT' }
  })
  pgm.addColumns(parcelTableName, {
    operator: { type: 'TEXT' }
  })
}
