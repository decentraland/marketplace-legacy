import { Model } from 'decentraland-commons'
import { Parcel } from '../Parcel'

export class Mortgage extends Model {
  static tableName = 'mortgages'
  static columnNames = [
    'tx_hash',
    'tx_status',
    'block_number',
    'status',
    'x',
    'y',
    'borrower',
    'lender',
    'loan_id',
    'mortgage_id',
    'amount',
    'expires_at',
    'dues_in',
    'block_time_created_at',
    'block_time_updated_at'
  ]
  static primaryKey = 'tx_hash'

  static STATUS = Object.freeze({
    open: 'open',
    claimed: 'claimed',
    cancelled: 'cancelled'
  })

  static findByBorrowerSql() {
    return `SELECT *
      FROM ${this.tableName}
      WHERE ${this.tableName}.borrower = ($1)
        AND ${this.tableName}.x = ${Parcel.tableName}.x
        AND ${this.tableName}.y = ${Parcel.tableName}.y
        AND ${this.tableName}.status != '${this.STATUS.cancelled}'
    `
  }

  static findParcelMortgageJsonSql(extra) {
    return `SELECT  row_to_json(m.*)
      FROM ${this.tableName} as m
      WHERE m.x = ${Parcel.tableName}.x
        AND m.y = ${Parcel.tableName}.y
      ORDER BY m.created_at DESC ${extra || ''}`
  }
}
