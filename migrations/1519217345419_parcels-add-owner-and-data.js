import { Parcel } from '../src/Asset'

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
