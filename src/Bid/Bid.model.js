import { Model } from 'decentraland-commons'

import { BlockchainEvent } from '../BlockchainEvent'
import { SQL, raw } from '../database'
import { LISTING_STATUS, LISTING_ASSET_TYPES } from '../shared/listing'

export class Bid extends Model {
  static tableName = 'bids'
  static primaryKey = 'id'
  static columnNames = [
    'id',
    'id',
    'token_address',
    'token_id',
    'bidder',
    'seller',
    'expires_at',
    'status',
    'asset_id',
    'asset_type',
    'block_number',
    'block_time_created_at',
    'block_time_updated_at',
    'created_at',
    'updated_at'
  ]
}
