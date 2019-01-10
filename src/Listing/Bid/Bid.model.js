import { Model } from 'decentraland-commons'

import { Listing } from '../Listing'
import { LISTING_STATUS } from '../../shared/listing'
import { SQL, raw } from '../../database'

export class Bid extends Model {
  static tableName = 'bids'
  static primaryKey = 'id'
  static columnNames = [
    'id',
    'price',
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

  // TODO: Add asset_type
  static async findByAssetIdWithStatus(asset_id, status) {
    return new Listing(this).findByAssetIdWithStatus(asset_id, status)
  }

  static async findByAssetId(asset_id) {
    return new Listing(this).findByAssetId(asset_id)
  }

  static async invalidateBids(tokenAddress, tokenId, blockTime) {
    return this.db.query(
      SQL`UPDATE ${raw(this.tableName)}
        SET status = ${LISTING_STATUS.cancelled}
        WHERE block_time_created_at <= ${blockTime}
          AND token_address = ${tokenAddress}
          AND token_id = ${tokenId}
          AND status = ${LISTING_STATUS.open}`
    )
  }
}
