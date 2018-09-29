import { Parcel, Estate } from '../src/Asset'

const estateTableName = Estate.tableName
const parcelTableName = Parcel.tableName

exports.up = pgm => {
  pgm.addColumns(estateTableName, {
    update_operator: { type: 'TEXT', unique: false, notNull: false }
  })
  pgm.addColumns(parcelTableName, {
    update_operator: { type: 'TEXT', unique: false, notNull: false }
  })
}

exports.down = pgm => {
  pgm.dropColumns(parcelTableName, {
    update_operator: { type: 'TEXT' }
  })
  pgm.dropColumns(estateTableName, {
    update_operator: { type: 'TEXT' }
  })
}
