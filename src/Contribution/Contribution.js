import { Model } from 'decentraland-commons'

export class Contribution extends Model {
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

  static findGroupedByAddress(address) {
    return this.db.query(
      `SELECT address, district_id, sum(land_count) as land_count
        FROM ${this.tableName}
        WHERE address = $1
        GROUP BY address, district_id`,
      [address]
    )
  }
}
