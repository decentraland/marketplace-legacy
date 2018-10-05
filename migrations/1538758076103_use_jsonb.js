import { Parcel, Estate } from '../src/Asset'

const estateTableName = Estate.tableName
const parcelTableName = Parcel.tableName

exports.up = pgm => {
  pgm.alterColumn(estateTableName, 'data', { type: 'JSONB' })
  pgm.alterColumn(parcelTableName, 'data', { type: 'JSONB' })
}

exports.down = pgm => {
  pgm.alterColumn(estateTableName, 'data', { type: 'JSON' })
  pgm.alterColumn(parcelTableName, 'data', { type: 'JSON' })
}
