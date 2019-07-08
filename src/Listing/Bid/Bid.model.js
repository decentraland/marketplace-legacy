import { Model } from 'decentraland-server'

import { Listing } from '../Listing'
import { ListingQueries } from '../Listing.queries'
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

  static async deleteBid(tokenAddress, tokenId, bidder, statuses) {
    return this.query(
      SQL`DELETE
      FROM ${raw(this.tableName)}
      WHERE ${BidQueries.isForToken(tokenAddress, tokenId)}
        AND ${ListingQueries.hasStatuses(statuses)}
        AND bidder = ${bidder}`
    )
  }

  static async findByAddress(address) {
    return this.query(
      SQL`SELECT *
        FROM ${raw(this.tableName)}
        WHERE ${BidQueries.bidderOrSeller(address)}`
    )
  }

  static async findByAddressAndStatus(address, status) {
    return this.query(
      SQL`SELECT *
        FROM ${raw(this.tableName)}
        WHERE ${BidQueries.bidderOrSeller(address)}
          AND ${ListingQueries.hasStatuses([status])}`
    )
  }

  static async findByAssetIdWithStatus(assetId, assetType, status) {
    return new Listing(this).findByAssetIdWithStatus(assetId, assetType, status)
  }

  static async findByAssetId(assetId, assetType) {
    return new Listing(this).findByAssetId(assetId, assetType)
  }

  static async cancelBids(blockTime, blockNumber, tokenAddress, tokenId) {
    return this.query(
      SQL`UPDATE ${raw(this.tableName)}
        SET status = ${
          LISTING_STATUS.cancelled
        }, block_time_updated_at = ${blockTime}, block_number = ${blockNumber}
        WHERE block_time_created_at <= ${blockTime}
          AND token_address = ${tokenAddress}
          AND token_id = ${tokenId}
          AND ${ListingQueries.hasStatuses([
            LISTING_STATUS.open,
            LISTING_STATUS.fingerprintChanged
          ])}`
    )
  }

  static async hasWithStatuses(tokenAddress, tokenId, statuses) {
    const result = await this.query(
      SQL`SELECT COUNT(*)
        FROM ${raw(this.tableName)}
        WHERE ${BidQueries.isForToken(tokenAddress, tokenId)}
          AND ${ListingQueries.hasStatuses(statuses)}`
    )
    return parseInt(result[0].count, 10)
  }

  /**
   * @dev Invalidate or re-validate bids when an asset changed its fingerprint.
   * @param {string} tokenAddress
   * @param {string} tokenId
   * @param {string} fingerprint
   * @param {time} blockTime
   */
  static async updateBidsByAssetFingerprintChange(
    blockTime,
    blockNumber,
    tokenAddress,
    tokenId,
    fingerprint
  ) {
    // Invalidate bids for assets with its fingerprint changed
    await this.query(
      SQL`UPDATE ${raw(this.tableName)}
        SET status = ${
          LISTING_STATUS.fingerprintChanged
        }, block_time_updated_at = ${blockTime}, block_number = ${blockNumber}
        WHERE block_time_created_at <= ${blockTime}
          AND ${BidQueries.isForToken(tokenAddress, tokenId)}
          AND ${ListingQueries.hasStatuses([LISTING_STATUS.open])}
          AND fingerprint != ${fingerprint}`
    )

    // Re-validate bids for assets with its fingerprint back to the original value
    await this.query(
      SQL`UPDATE ${raw(this.tableName)}
        SET status = ${
          LISTING_STATUS.open
        }, block_time_updated_at = ${blockTime}, block_number = ${blockNumber}
        WHERE block_time_created_at <= ${blockTime}
          AND ${BidQueries.isForToken(tokenAddress, tokenId)}
          AND ${ListingQueries.hasStatuses([LISTING_STATUS.fingerprintChanged])}
          AND fingerprint = ${fingerprint}`
    )
  }

  static async updateAssetOwner(
    seller,
    blockTime,
    blockNumber,
    tokenAddress,
    assetId
  ) {
    return this.query(
      SQL`UPDATE ${raw(this.tableName)}
        SET seller = ${seller}, block_time_updated_at = ${blockTime}, block_number = ${blockNumber}
        WHERE block_time_created_at <= ${blockTime}
          AND token_address = ${tokenAddress}
          AND asset_id = ${assetId}
          AND ${ListingQueries.hasStatuses([
            LISTING_STATUS.open,
            LISTING_STATUS.fingerprintChanged
          ])}`
    )
  }

  static async findBidAssetsByStatuses(
    address,
    statuses = Object.values(LISTING_STATUS)
  ) {
    let assets = await db.query(
      SQL`SELECT row_to_json(bid.*) as bids, ${ListingQueries.selectListableAssets()}
          FROM ${raw(this.tableName)} as bid
          ${ListingQueries.joinListableAssets('bid')}
          WHERE ${BidQueries.bidderOrSeller(address)}
            AND ${EstateQueries.estateHasParcels('bid')}
            AND ${ListingQueries.hasStatuses(statuses)}`
    )

    // Keep only the model that had a bid defined from the Assets list
    return Listing.filterAssetsByModelAssets(assets)
  }

  static async updateExpired() {
    return new Listing(this).updateExpired()
  }
}
