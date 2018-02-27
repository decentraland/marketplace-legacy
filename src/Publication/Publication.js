import { Model } from 'decentraland-commons'

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
    'expires_at'
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
}
