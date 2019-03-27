import { Parcel, Estate } from '../src/Asset'

const parcelTableName = Parcel.tableName
const estateTableName = Estate.tableName

exports.up = pgm => {
  pgm.dropConstraint(parcelTableName, 'ref_estate_id', { ifExists: true })
}

exports.down = pgm => {
  pgm.addConstraint(parcelTableName, 'ref_estate_id', {
    foreignKeys: {
      columns: ['estate_id'],
      references: `"${estateTableName}" (id)`,
      onDelete: 'SET NULL'
    }
  })
}
