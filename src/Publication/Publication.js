import { Model } from 'decentraland-commons'
import { BlockchainEvent } from '../BlockchainEvent'

export class Publication extends Model {
  static tableName = 'publications'
  static columnNames = [
    'tx_hash',
    'tx_status',
    'status',
    'x',
    'y',
    'owner',
    'buyer',
    'price',
    'expires_at',
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

  static findByStatus(status) {
    return this.db.query(this.findByStatusSql(status))
  }

  static findOpenSql(status) {
    if (!this.isValidStatus(status)) {
      throw new Error(`Trying to filter by invalid status '${status}'`)
    }

    return `
      SELECT * FROM ${this.tableName}
        WHERE status = '${status}'
        ORDER BY created_at DESC`
  }

  static async cancelOlder(block_number, { owner, x, y }) {
    const args = [
      BlockchainEvent.EVENTS.publicationCreated,
      block_number,
      owner,
      x,
      y,
      this.STATUS.open
    ]
    const rows = await this.db.query(
      `SELECT p.tx_hash
        FROM ${this.tableName} p
        JOIN ${
          BlockchainEvent.tableName
        } b ON p.tx_hash = b.tx_hash AND name = $1
        WHERE b.block_number < $2
          AND p.owner = $3
          AND p.x = $4
          AND p.y = $5
          AND p.status = $6`,
      args
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
    // 1 -> newStatus, 2 -> IN
    const inPlaceholders = txHashes.map((_, index) => `$${index + 2}`)

    return this.db.query(
      `UPDATE ${this.tableName}
        SET status = $1
        WHERE tx_hash IN (${inPlaceholders})`,
      [newStatus, ...txHashes]
    )
  }
}
