import { Parcel } from '../src/Parcel'
import { Estate } from '../src/Estate'

const tableName = Parcel.tableName

exports.up = pgm => {
  pgm.addConstraint(tableName, 'ref_estate_id', {
    foreignKeys: {
      columns: ['estate_id'],
      references: `"${Estate.tableName}"`,
      onDelete: 'SET NULL'
    }
  })
}

exports.down = pgm => {
  pgm.dropConstraint(tableName, 'ref_estate_id', {
    foreignKeys: {
      columns: ['estate_id'],
      references: `"${Estate.tableName}"`,
      onDelete: 'SET NULL'
    }
  })
}
