import { Bid } from '../src/Listing'
import { LISTING_ASSET_TYPES } from '../shared/listing'

const tableName = Bid.tableName

exports.up = pgm => {
  pgm.createTable(tableName, {
    id: { type: 'TEXT', primaryKey: true, notNull: true },
    token_address: { type: 'TEXT', notNull: true },
    token_id: { type: 'TEXT', notNull: true },
    bidder: { type: 'TEXT', notNull: true },
    seller: 'TEXT',
    price: { type: 'FLOAT', notNull: true },
    expires_at: { type: 'BIGINT', notNull: true },
    fingerprint: { type: 'TEXT', notNull: true },
    status: 'TEXT',
    asset_id: {
      type: 'TEXT',
      notNull: true
    },
    asset_type: {
      type: 'TEXT',
      default: LISTING_ASSET_TYPES.parcel,
      notNull: true
    },
    block_number: { type: 'INT', notNull: true },
    block_time_created_at: { type: 'BIGINT', notNull: true },
    block_time_updated_at: { type: 'BIGINT' },
    created_at: { type: 'TIMESTAMP', notNull: true },
    updated_at: 'TIMESTAMP'
  })

  pgm.createIndex(tableName, 'bidder')
  pgm.createIndex(tableName, 'seller')
  pgm.createIndex(tableName, 'asset_id')
}

exports.down = pgm => {
  pgm.dropTable(tableName)
}
