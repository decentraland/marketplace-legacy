import { Model } from 'decentraland-server'
import { SQL } from '../database'

export class Contribution extends Model {
  static tableName = 'contributions'
  static columnNames = [
    'id',
    'address',
    'district_id',
    'land_count',
    'timestamp'
  ]

  static async isContributor(address, district_id) {
    const exists = await this.count({ address, district_id })
    return exists > 0
  }

  static findByAddress(address) {
    return this.find({ address })
  }

  static findGroupedByAddress(address) {
    return this.query(
      SQL`SELECT address, district_id, sum(land_count) as land_count
        FROM ${SQL.raw(this.tableName)}
        WHERE address = ${address}
        GROUP BY address, district_id`
    )
  }
}
