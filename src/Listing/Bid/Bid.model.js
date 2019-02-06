import { Model } from 'decentraland-commons'

import { Listing } from '../Listing'
import { BidQueries } from './Bid.queries'
import { db, SQL, raw } from '../../database'
import { EstateQueries } from '../../Asset'
import { LISTING_STATUS } from '../../shared/listing'

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

  static async findByAddress(address) {
    return this.db.query(
      SQL`SELECT * 
        FROM ${raw(this.tableName)}
        WHERE ${BidQueries.bidderOrSeller(address)}`
    )
  }

  static async findByAddressAndStatus(address, status) {
    return this.db.query(
      SQL`SELECT * 
        FROM ${raw(this.tableName)}
        WHERE ${BidQueries.bidderOrSeller(address)} 
          AND status = ${status}`
    )
  }

  static async findByAssetIdWithStatus(assetId, assetType, status) {
    return new Listing(this).findByAssetIdWithStatus(assetId, assetType, status)
  }

  static async findByAssetId(assetId, assetType) {
    return new Listing(this).findByAssetId(assetId, assetType)
  }

  static async invalidateBids(tokenAddress, tokenId, blockTime, blockNumber) {
    return this.db.query(
      SQL`UPDATE ${raw(this.tableName)}
        SET status = ${
          LISTING_STATUS.cancelled
        }, block_time_updated_at = ${blockTime}, block_number = ${blockNumber}
        WHERE block_time_created_at <= ${blockTime}
          AND token_address = ${tokenAddress}
          AND token_id = ${tokenId}
          AND status = ANY(${[
            LISTING_STATUS.open,
            LISTING_STATUS.fingerprintChanged
          ]})`
    )
  }

  static async getWithStatuses(tokenAddress, tokenId, statuses) {
    return this.db.query(
      SQL`SELECT *
        FROM ${raw(this.tableName)}
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
    blockTime,
    blockNumber
  ) {
    // Invalidate bids for assets with its fingerprint changed
    await this.db.query(
      SQL`UPDATE ${raw(this.tableName)}
        SET status = ${
          LISTING_STATUS.fingerprintChanged
        }, block_time_updated_at = ${blockTime}, block_number = ${blockNumber}
        WHERE block_time_created_at <= ${blockTime}
          AND token_address = ${tokenAddress}
          AND token_id = ${tokenId}
          AND status = ${LISTING_STATUS.open}
          AND fingerprint != ${fingerprint}`
    )

    // Re-validate bids for assets with its fingerprint back to the original value
    await this.db.query(
      SQL`UPDATE ${raw(this.tableName)}
        SET status = ${
          LISTING_STATUS.open
        }, block_time_updated_at = ${blockTime}, block_number = ${blockNumber}
        WHERE block_time_created_at <= ${blockTime}
          AND token_address = ${tokenAddress}
          AND token_id = ${tokenId}
          AND status = ${LISTING_STATUS.fingerprintChanged}
          AND fingerprint = ${fingerprint}`
    )
  }

  static async updateAssetOwner(
    tokenAddress,
    assetId,
    seller,
    blockTime,
    blockNumber
  ) {
    return this.db.query(
      SQL`UPDATE ${raw(this.tableName)}
        SET seller = ${seller}, block_time_updated_at = ${blockTime}, block_number = ${blockNumber}
        WHERE block_time_created_at <= ${blockTime}
          AND token_address = ${tokenAddress} 
          AND asset_id = ${assetId}
          AND status = ANY(${[
            LISTING_STATUS.open,
            LISTING_STATUS.fingerprintChanged
          ]})`
    )
  }

  static async findBidAssetsByStatuses(
    address,
    status = Object.values(LISTING_STATUS)
  ) {
    const Assets = new Listing.getListableAssets()

    const selectAssetsSQL = Assets.map(
      ({ tableName }) => `row_to_json(${tableName}.*) as ${tableName}`
    ).join(', ')

    const joinAssetsSQL = Assets.map(
      ({ tableName }) =>
        `LEFT JOIN ${tableName} as ${tableName} ON ${tableName}.id = bid.asset_id`
    ).join('\n')

    let assets = await db.query(
      SQL`SELECT row_to_json(bid.*) as bids, ${raw(selectAssetsSQL)}
          FROM ${raw(this.tableName)} as bid
          ${raw(joinAssetsSQL)}
          WHERE ${BidQueries.bidderOrSeller(address)}
            AND ${EstateQueries.estateHasParcels('bid')}
            AND status = ANY(${status})`
    )

    // Keep only the model that had a bid defined from the Assets list
    assets = assets.map(asset => {
      for (const Model of Assets) {
        if (asset[Model.tableName] != null) {
          Object.assign(asset, asset[Model.tableName])
        }
        delete asset[Model.tableName]
      }
      return asset
    })

    return assets
  }
}
