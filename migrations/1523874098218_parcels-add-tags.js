import { Parcel } from '../src/Asset'

exports.up = pgm => {
  const tableName = Parcel.tableName

  pgm.addColumns(tableName, {
    tags: {
      type: 'JSON',
      default: '{}'
    }
  })
}
