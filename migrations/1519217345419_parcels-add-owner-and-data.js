import { Parcel } from '../src/Parcel'

const tableName = Parcel.tableName

exports.up = pgm => {
  pgm.addColumns(tableName, {
    owner: {
      type: 'VARCHAR(42)'
    },
    data: {
      type: 'JSON'
    }
  })
}
