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

  static findByOwner(owner) {
    return this.find({ owner })
  }

  static findInCoordinate(x, y) {
    return this.find({ x, y }, { created_at: 'DESC' })
  }

  static findLastOpen() {
    return this.db.query(this.findLastOpenSql())
  }

  static findLastOpenSql() {
    return `
      SELECT * FROM ${this.tableName}
        WHERE status = '${this.STATUS.open}'
        ORDER BY created_at DESC
        LIMIT 1`
  }
}
