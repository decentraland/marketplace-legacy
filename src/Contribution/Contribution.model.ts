import { Model } from 'decentraland-commons'
import { SQL } from '../database'

export interface ContributionAttributes {
  id: string
  address: string
  district_id: string
  land_count: number
  timestamp: number
  created_at?: Date
  updated_at?: Date
}

export class Contribution extends Model {
  static tableName = 'contributions'
  static columnNames = [
    'id',
    'address',
    'district_id',
    'land_count',
    'timestamp'
  ]

  static findByAddress(address: string): Promise<ContributionAttributes[]> {
    return this.find({ address })
  }

  static findGroupedByAddress(
    address: string
  ): Promise<ContributionAttributes[]> {
    return this.db.query(
      SQL`SELECT address, district_id, sum(land_count) as land_count
        FROM ${SQL.raw(this.tableName)}
        WHERE address = ${address}
        GROUP BY address, district_id`
    )
  }
}
