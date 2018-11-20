import { Model } from 'decentraland-commons'
import { BlockchainEvent } from '../BlockchainEvent'
import { SQL, toRawStrings } from '../database'
import {
  PUBLICATION_STATUS,
  PUBLICATION_ASSET_TYPES
} from '../shared/publication'

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

  static cachedTable = null

  static async invalidateCache() {
    this.cachedTable = null
  }

  static async buildCache() {
    this.cachedTable = {}
    for (let i of PUBLICATION_ASSET_TYPES) {
      this.cachedTable[i] = {}
    }
    const results = await this.find({
      expires_at: '>= EXTRACT(epoch from now()) * 1000'
    })
    for (let i of results) {
      this.cachedTable[i.asset_type][i.asset_uid] = i
    }
  }

  static async setupListener() {
    this.db.client.on('notification', msg => {
      if (
        msg.name === 'notification' &&
        msg.channel === 'publications_updated'
      ) {
        this.invalidateCache()
      }
    })
  }

  static isValidStatus(status) {
    return Object.values(PUBLICATION_STATUS).includes(status)
  }

  static isValidAssetType(assetType) {
    return Object.values(PUBLICATION_ASSET_TYPES).includes(assetType)
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

  static async cachedFindLatestActive(assetTableName, assetId) {
    if (!this.cachedTable) {
      await this.buildCachedTable()
    }
    return this.cachedTable[assetTableName][assetId]
  }

  // TODO: Add asset_type
  static deleteByAssetId(assetId) {
    return this.delete({ asset_id: assetId })
  }

  static async cancelOlder(asset_id, block_number, eventName) {
    const status = PUBLICATION_STATUS.open

    const rows = await this.db.query(
      SQL`SELECT p.tx_hash
        FROM ${SQL.raw(this.tableName)} p
        JOIN ${SQL.raw(
          BlockchainEvent.tableName
        )} b ON p.tx_hash = b.tx_hash AND name = ${eventName}
        WHERE b.block_number < ${block_number}
          AND p.asset_id = ${asset_id}
          AND p.status = ${status}`
    )
    const txHashes = rows.map(row => row.tx_hash)

    if (txHashes.length) {
      await this.updateManyStatus(txHashes, PUBLICATION_STATUS.cancelled)
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
      SQL`UPDATE ${SQL.raw(this.tableName)}
        SET status = ${newStatus}
        WHERE tx_hash IN (${toRawStrings(txHashes)})`
    )
  }
}
