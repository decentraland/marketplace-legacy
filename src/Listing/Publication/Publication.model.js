import { Model } from 'decentraland-server'

import { Listing } from '../Listing'
import { ListingQueries } from '../Listing.queries'
import { PublicationQueries } from './Publication.queries'
import { BlockchainEvent } from '../../BlockchainEvent'
import { SQL, raw } from '../../database'
import { LISTING_STATUS } from '../../shared/listing'

export class Publication extends Model {
  static tableName = 'publications'
  static primaryKey = 'tx_hash'
  static columnNames = [
    'tx_hash',
    'tx_status',
    'asset_id',
    'asset_type',
    'marketplace_address',
    'block_number',
    'status',
    'owner',
    'buyer',
    'price',
    'expires_at',
    'block_time_created_at',
    'block_time_updated_at',
    'contract_id'
  ]

  static findByOwner(owner) {
    return new Listing(this).findByOwner(owner)
  }

  static async findByAssetIdWithStatus(assetId, assetType, status) {
    return new Listing(this).findByAssetIdWithStatus(assetId, assetType, status)
  }

  static async findByAssetId(assetId, assetType) {
    return new Listing(this).findByAssetId(assetId, assetType)
  }

  // TODO: Add asset_type
  static deleteByAssetId(assetId) {
    return new Listing(this).deleteByAssetId(assetId)
  }

  static async findActiveByAssetIdWithStatus(asset_id, status) {
    if (!Listing.isValidStatus(status)) {
      throw new Error(`Invalid status "${status}"`)
    }

    const result = await this.query(
      SQL`SELECT *
        FROM ${raw(this.tableName)}
        WHERE status = ${status}
          AND asset_id = ${asset_id}
          AND ${PublicationQueries.isActive()}
        ORDER BY created_at DESC
        LIMIT 1`
    )
    return result[0]
  }

  static async findInactive() {
    return this.query(
      SQL`SELECT *
        FROM ${raw(this.tableName)}
        WHERE ${ListingQueries.isInactive()}
          AND ${ListingQueries.hasStatus(LISTING_STATUS.open)}`
    )
  }

  static async cancelOlder(asset_id, block_number, eventName) {
    const status = LISTING_STATUS.open

    const rows = await this.query(
      SQL`SELECT p.tx_hash
        FROM ${raw(this.tableName)} p
        JOIN ${raw(
          BlockchainEvent.tableName
        )} b ON p.tx_hash = b.tx_hash AND name = ${eventName}
        WHERE b.block_number < ${block_number}
          AND p.asset_id = ${asset_id}
          AND p.status = ${status}`
    )
    const txHashes = rows.map(row => row.tx_hash)

    if (txHashes.length) {
      await this.updateManyStatus(txHashes, LISTING_STATUS.cancelled)
    }
  }

  static updateManyStatus(txHashes, newStatus) {
    if (txHashes.length === 0) {
      return []
    }
    if (!Listing.isValidStatus(newStatus)) {
      throw new Error(`Trying to filter by invalid status "${newStatus}"`)
    }

    return this.query(
      SQL`UPDATE ${raw(this.tableName)}
        SET status = ${newStatus},
            updated_at = NOW()
        WHERE tx_hash = ANY(${txHashes})`
    )
  }

  static async updateExpired() {
    return new Listing(this).updateExpired()
  }
}
