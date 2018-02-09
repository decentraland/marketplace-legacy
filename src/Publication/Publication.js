import { Model } from 'decentraland-commons'

export class Publication extends Model {
  static tableName = 'publications'
  static columnNames = ['tx_hash', 'address', 'price', 'status', 'expires_at']

  static findByAddress(address) {
    return this.find({ address })
  }
}
