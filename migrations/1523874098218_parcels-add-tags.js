import { Parcel } from '../src/Parcel'

exports.up = pgm => {
  const tableName = Parcel.tableName

  pgm.addColumns(tableName, {
    tag: {
      type: 'JSON',
      default: null
    }
  })
}
