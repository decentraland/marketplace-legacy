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
    sold: 'claimed',
    cancelled: 'cancelled'
  })

  static isValidStatus(status) {
    return Object.values(this.STATUS).includes(status)
  }

  static findByBorrower(borrower) {
    return this.find({ borrower })
  }

  static findInCoordinate(x, y) {
    return this.find({ x, y }, { created_at: 'DESC' })
  }

  static findInCoordinateByBorrower(x, y, borrower) {
    return this.find({ x, y, borrower }, { created_at: 'DESC' })
  }

  static findInCoordinateWithStatus(x, y, status) {
    if (!this.isValidStatus(status)) {
      throw new Error(`Invalid status '${status}'`)
    }

    return this.find({ x, y, status }, { created_at: 'DESC' })
  }

  static findMortgagesByStatusSql(status = null) {
    if (!this.isValidStatus(status)) {
      throw new Error(`Invalid status '${status}'`)
    }

    return `SELECT *
      FROM ${this.tableName}
      WHERE status = '${status}'
        AND expires_at >= EXTRACT(epoch from now()) * 1000
      ORDER BY created_at DESC`
  }

  static findParcelMortgageJsonSql() {
    return `SELECT  row_to_json(m.*)
      FROM ${this.tableName} as m
      WHERE m.x = ${Parcel.tableName}.x
        AND m.y = ${Parcel.tableName}.y
      ORDER BY m.created_at DESC`
  }
}
