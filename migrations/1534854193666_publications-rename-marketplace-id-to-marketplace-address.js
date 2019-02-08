import { Publication } from '../src/Listing'

exports.up = pgm => {
  pgm.renameColumn(
    Publication.tableName,
    'marketplace_id',
    'marketplace_address'
  )
}

exports.down = pgm => {
  pgm.renameColumn(
    Publication.tableName,
    'marketplace_address',
    'marketplace_id'
  )
}
