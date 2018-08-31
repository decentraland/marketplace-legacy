import { Mortgage } from '../src/Mortgage'

exports.up = pgm => {
  pgm.renameColumn(Mortgage.tableName, 'type', 'asset_type')
}

exports.down = pgm => {
  pgm.renameColumn(Mortgage.tableName, 'asset_type', 'type')
}
