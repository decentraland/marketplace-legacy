import { Model } from 'decentraland-commons'
import { BlockchainEvent } from '../BlockchainEvent'
import { SQL } from '../database'

export interface PublicationAttributes {
  tx_hash: string
  tx_status: string
  asset_id: string
  contract_id: string
  marketplace_id: string
  type: string
  status: string
  owner: string
  buyer: string
  price: number
  block_number: number
  expires_at: number
  block_time_created_at: number
  block_time_updated_at: number
  created_at?: Date
  updated_at?: Date
}

export class Publication extends Model {
  static tableName = 'publications'
  static primaryKey = 'tx_hash'
  static columnNames = [
    'tx_hash',
    'tx_status',
    'asset_id',
    'contract_id',
    'marketplace_id',
    'type',
    'status',
    'owner',
    'buyer',
    'price',
    'block_number',
    'expires_at',
    'block_time_created_at',
    'block_time_updated_at'
  ]

  static STATUS = Object.freeze({
    open: 'open',
    sold: 'sold',
    cancelled: 'cancelled'
  })

  static TYPES = Object.freeze({
    parcel: 'parcel',
    estate: 'estate'
  })

  static isValidStatus(status: string): boolean {
    return Object.values(this.STATUS).includes(status)
  }

  static isValidType(type: string): boolean {
    return Object.values(this.TYPES).includes(type)
  }

  static findByOwner(owner: string): Promise<PublicationAttributes[]> {
    return this.find({ owner })
  }

  static findByAssetId(asset_id: string): Promise<PublicationAttributes[]> {
    return this.find({ asset_id }, { created_at: 'DESC' })
  }

  static findByAssetIdWithStatus(
    asset_id: string,
    status: string
  ): Promise<PublicationAttributes[]> {
    if (!this.isValidStatus(status)) {
      throw new Error(`Invalid status "${status}"`)
    }

    return this.find({ asset_id, status }, { created_at: 'DESC' })
  }

  static async cancelOlder(asset_id: string, block_number: number) {
    const name = BlockchainEvent.EVENTS.publicationCreated
    const status = this.STATUS.open

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
      await this.updateManyStatus(txHashes, this.STATUS.cancelled)
    }
  }

  static updateManyStatus(txHashes: string[], newStatus: string) {
    if (txHashes.length === 0) {
      return []
    }
    if (!this.isValidStatus(newStatus)) {
      throw new Error(`Trying to filter by invalid status "${newStatus}"`)
    }

    return this.db.query(
      SQL`UPDATE ${SQL.raw(this.tableName)}
        SET status = ${newStatus}
        WHERE tx_hash IN (${txHashes})`
    )
  }
}
