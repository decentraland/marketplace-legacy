import { Parcel } from '../src/Parcel'

exports.up = pgm => {
  const tableName = Parcel.tableName

  pgm.addColumns(tableName, {
    asset_id: {
      type: 'TEXT',
      default: null
    }
  })

  pgm.createIndex(tableName, 'asset_id')
}
