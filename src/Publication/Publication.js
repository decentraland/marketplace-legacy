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
}
