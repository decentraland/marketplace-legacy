import { Model } from 'decentraland-commons'

export class Publication extends Model {
  static tableName = 'publications'
  static columnNames = [
    'tx_hash',
    'tx_status',
    'x',
    'y',
    'address',
    'price',
    'is_sold',
    'expires_at'
  ]
  static primaryKey = 'tx_hash'

  static findByAddress(address) {
    return this.find({ address })
  }
}
