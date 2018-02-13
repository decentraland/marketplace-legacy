import { Model } from 'decentraland-commons'

export class Publication extends Model {
  static tableName = 'publications'
  static columnNames = [
    'tx_hash',
    'address',
    'x',
    'y',
    'price',
    'is_sold',
    'tx_status',
    'expires_at'
  ]
  static primaryKey = 'tx_hash'

  static findByAddress(address) {
    return this.find({ address })
  }
}
