import { Parcel, Estate } from '../src/Asset'

exports.up = pgm => {
  pgm.renameColumn(Parcel.tableName, 'asset_id', 'token_id')
  pgm.renameColumn(Estate.tableName, 'asset_id', 'token_id')
}

exports.down = pgm => {
  pgm.renameColumn(Parcel.tableName, 'token_id', 'asset_id')
  pgm.renameColumn(Estate.tableName, 'token_id', 'asset_id')
}
