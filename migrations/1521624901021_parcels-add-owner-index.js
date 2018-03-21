import { Parcel } from '../src/Parcel'

exports.up = pgm => {
  const tableName = Parcel.tableName
  pgm.createIndex(tableName, 'owner')
}
