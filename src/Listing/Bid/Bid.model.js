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
    'fingerprint',
    'status',
    'asset_id',
    'asset_type',
    'block_number',
    'block_time_created_at',
    'block_time_updated_at',
    'created_at',
    'updated_at'
  ]

  static async findByAssetIdWithStatus(assetId, assetType, status) {
    return new Listing(this).findByAssetIdWithStatus(assetId, assetType, status)
  }

  static async findByAssetId(assetId, assetType) {
    return new Listing(this).findByAssetId(assetId, assetType)
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

  static async getWithStatuses(tokenAddress, tokenId, statuses) {
    return this.db.query(
      SQL`SELECT * from ${raw(this.tableName)}
        WHERE token_address = ${tokenAddress}
          AND token_id = ${tokenId}
          AND status = ANY(${statuses})`
    )
  }

  /**
   * @dev Invalidate or re-validate bids when an asset changed its fingerprint.
   * @param {string} tokenAddress
   * @param {string} tokenId
   * @param {string} fingerprint
   * @param {time} blockTime
   */
  static async updateAssetByFingerprintChange(
    tokenAddress,
    tokenId,
    fingerprint,
    blockTime
  ) {
    // Invalidate bids for assets with its fingerprint changed
    await this.db.query(
      SQL`UPDATE ${raw(this.tableName)}
        SET status = ${LISTING_STATUS.fingerprintChanged}
        WHERE block_time_created_at <= ${blockTime}
          AND token_address = ${tokenAddress}
          AND token_id = ${tokenId}
          AND status = ${LISTING_STATUS.open}
          AND fingerprint != ${fingerprint}`
    )

    // Re-validate bids for assets with its fingerprint back to the original value
    await this.db.query(
      SQL`UPDATE ${raw(this.tableName)}
        SET status = ${LISTING_STATUS.open}
        WHERE block_time_created_at <= ${blockTime}
          AND token_address = ${tokenAddress}
          AND token_id = ${tokenId}
          AND status = ${LISTING_STATUS.fingerprintChanged}
          AND fingerprint = ${fingerprint}`
    )
  }
}
