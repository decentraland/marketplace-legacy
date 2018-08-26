import { Model } from 'decentraland-commons'
import { BlockchainEvent } from '../BlockchainEvent'
import { SQL, toRawStrings } from '../database'
import { PUBLICATION_STATUS, PUBLICATION_TYPES } from '../shared/publication'

export class Publication extends Model {
  static tableName = 'publications'
  static primaryKey = 'tx_hash'
  static columnNames = [
    'tx_hash',
    'tx_status',
    'asset_id',
    'type',
    'marketplace_id',
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
    return Object.values(PUBLICATION_STATUS).includes(status)
  }

  static isValidType(type) {
    return Object.values(PUBLICATION_TYPES).includes(type)
  }

  static findByOwner(owner) {
    return this.find({ owner })
  }

  static findByAssetId(asset_id) {
    return this.find({ asset_id }, { created_at: 'DESC' })
  }

  static findByAssetIdWithStatus(asset_id, status) {
    if (!this.isValidStatus(status)) {
      throw new Error(`Invalid status "${status}"`)
    }

    return this.find({ asset_id, status }, { created_at: 'DESC' })
  }

  static deleteByAsset(asset) {
    return this.delete({ asset_id: asset.id })
  }

  static async cancelOlder(asset_id, block_number) {
    const events = BlockchainEvent.getEvents()
    const name = BlockchainEvent.getEventName(events.publicationCreated)
    const status = PUBLICATION_STATUS.open

    const rows = await this.db.query(
      SQL`SELECT p.tx_hash
        FROM ${SQL.raw(this.tableName)} p
        JOIN ${SQL.raw(
          BlockchainEvent.tableName
        )} b ON p.tx_hash = b.tx_hash AND name = ${name}
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
