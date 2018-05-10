import { Model } from 'decentraland-commons'

export class Mortgage extends Model {
  static tableName = 'mortgages'
  static columnNames = [
    'tx_hash',
    'tx_status',
    'block_number',
    'status',
    'x',
    'y',
    'borrower',
    'lender',
    'loan_id',
    'mortgage_id',
    'amount',
    'dues_in',
    'block_time_created_at',
    'block_time_updated_at',
    'contract_id'
  ]
  static primaryKey = 'tx_hash'

  static STATUS = Object.freeze({
    open: 'open',
    sold: 'claimed',
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

  static findMortgagesByStatusSql(status = null) {
    if (!this.isValidStatus(status)) {
      throw new Error(`Invalid status '${status}'`)
    }

    return `SELECT *
      FROM ${this.tableName}
      WHERE status = '${status}'
        AND expires_at >= EXTRACT(epoch from now()) * 1000
      ORDER BY created_at DESC`
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
