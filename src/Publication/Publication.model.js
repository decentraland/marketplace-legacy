import { Model } from 'decentraland-commons'
import { BlockchainEvent } from '../BlockchainEvent'
import { SQL } from '../database'

export class Publication extends Model {
  static tableName = 'publications'
  static columnNames = [
    'tx_hash',
    'tx_status',
    'block_number',
    'status',
    'x',
    'y',
    'owner',
    'buyer',
    'price',
    'expires_at',
    'block_time_created_at',
    'block_time_updated_at',
    'contract_id'
  ]
  static primaryKey = 'tx_hash'

  static STATUS = Object.freeze({
    open: 'open',
    sold: 'sold',
    cancelled: 'cancelled'
  })

  static isValidStatus(status) {
    return Object.values(this.STATUS).includes(status)
  }

  static findByOwner(owner) {
    return this.find({ owner })
  }

  static findInCoordinate(x, y) {
    return this.find({ x, y }, { created_at: 'DESC' })
  }

  static findInCoordinateWithStatus(x, y, status) {
    if (!this.isValidStatus(status)) {
      throw new Error(`Invalid status '${status}'`)
    }

    return this.find({ x, y, status }, { created_at: 'DESC' })
  }

  static async cancelOlder(x, y, block_number) {
    const name = BlockchainEvent.EVENTS.publicationCreated
    const status = this.STATUS.open

    const rows = await this.db.query(
      SQL`SELECT p.tx_hash
        FROM ${SQL.raw(this.tableName)} p
        JOIN ${SQL.raw(
          BlockchainEvent.tableName
        )} b ON p.tx_hash = b.tx_hash AND name = ${name}
        WHERE b.block_number < ${block_number}
          AND p.x = ${x}
          AND p.y = ${y}
          AND p.status = ${status}`
    )
    const txHashes = rows.map(row => row.tx_hash)

    if (txHashes.length) {
      await this.updateManyStatus(txHashes, this.STATUS.cancelled)
    }
  }

  static updateManyStatus(txHashes, newStatus) {
    if (txHashes.length === 0) {
      return []
    }
    if (!this.isValidStatus(newStatus)) {
      throw new Error(`Trying to filter by invalid status '${newStatus}'`)
    }

    return this.db.query(
      SQL`UPDATE ${SQL.raw(this.tableName)}
        SET status = ${newStatus}
        WHERE tx_hash IN (${txHashes})`
    )
  }
}
