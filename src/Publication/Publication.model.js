import { Model } from 'decentraland-commons'

import { PublicationQueries } from './Publication.queries'
import { BlockchainEvent } from '../BlockchainEvent'
import { SQL, raw } from '../database'
import { LISTING_STATUS, LISTING_ASSET_TYPES } from '../shared/listing'

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

  static isValidStatus(status) {
    return Object.values(LISTING_STATUS).includes(status)
  }

  static isValidAssetType(assetType) {
    return Object.values(LISTING_ASSET_TYPES).includes(assetType)
  }

  static findByOwner(owner) {
    return this.find({ owner })
  }

  // TODO: Add asset_type
  static findByAssetId(asset_id) {
    return this.find({ asset_id }, { created_at: 'DESC' })
  }

  // TODO: Add asset_type
  static findByAssetIdWithStatus(asset_id, status) {
    if (!this.isValidStatus(status)) {
      throw new Error(`Invalid status "${status}"`)
    }

    return this.find({ asset_id, status }, { created_at: 'DESC' })
  }

  // TODO: Add asset_type
  static async findActiveByAssetIdWithStatus(asset_id, status) {
    if (!this.isValidStatus(status)) {
      throw new Error(`Invalid status "${status}"`)
    }

    const result = await this.db.query(
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
    return this.db.query(
      SQL`SELECT *
        FROM ${raw(this.tableName)}
        WHERE ${PublicationQueries.isInactive()}
          AND ${PublicationQueries.hasStatus(LISTING_STATUS.open)}`
    )
  }

  // TODO: Add asset_type
  static deleteByAssetId(assetId) {
    return this.delete({ asset_id: assetId })
  }

  static async cancelInactive() {
    return this.db.query(SQL`
      UPDATE ${raw(this.tableName)}
        SET updated_at = NOW(),
            status = ${LISTING_STATUS.cancelled}
      WHERE ${PublicationQueries.isInactive()}
        AND ${PublicationQueries.hasStatus(LISTING_STATUS.open)}`)
  }

  static async cancelOlder(asset_id, block_number, eventName) {
    const status = LISTING_STATUS.open

    const rows = await this.db.query(
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
    if (!this.isValidStatus(newStatus)) {
      throw new Error(`Trying to filter by invalid status "${newStatus}"`)
    }

    return this.db.query(
      SQL`UPDATE ${raw(this.tableName)}
        SET status = ${newStatus},
            updated_at = NOW()
        WHERE tx_hash = ANY(${txHashes})`
    )
  }
}
