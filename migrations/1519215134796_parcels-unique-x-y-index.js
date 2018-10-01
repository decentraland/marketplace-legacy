import { Parcel } from '../src/Asset'

const tableName = Parcel.tableName

exports.up = pgm => {
  pgm.dropIndex(tableName, ['x', 'y'], { name: 'parcels_x_y_idx' })
  pgm.createIndex(tableName, ['x', 'y'], { unique: true })
}

exports.down = pgm => {
  pgm.createIndex(tableName, ['x', 'y'], { name: 'parcels_x_y_idx' })
  pgm.dropIndex(tableName, ['x', 'y'], { unique: true })
}
