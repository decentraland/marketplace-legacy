import { Model } from 'decentraland-commons'

class Contribution extends Model {
  static tableName = 'contributions'
  static columnNames = [
    'id',
    'address',
    'district_id',
    'land_count',
    'timestamp'
  ]

  static findByAddress(address) {
    return this.find({ address })
  }
}

export default Contribution
