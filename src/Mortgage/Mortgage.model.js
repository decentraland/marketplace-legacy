import { Model } from 'decentraland-commons'
import { SQL, raw } from '../database'
import { BlockchainEvent } from "../BlockchainEvent";

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
    'is_due_at',
    'block_time_created_at',
    'block_time_updated_at'
  ]
  static primaryKey = 'tx_hash'

  static STATUS = Object.freeze({
    open: 'open',
    claimed: 'claimed',
    cancelled: 'cancelled'
  })

  static findActivesByBorrower(borrower) {
    return this.db.query(
      SQL`SELECT * FROM ${raw(this.tableName)}
        WHERE borrower = ${borrower}
          AND status != '${raw(this.STATUS.cancelled)}'
          ORDER BY created_at DESC`
    )
  }

  static findActivesInCoordinate(x, y) {
    return this.db.query(
      SQL`SELECT * FROM ${raw(this.tableName)}
        WHERE x = ${x} AND y = ${y}
          AND status != '${raw(this.STATUS.cancelled)}'
          ORDER BY created_at DESC`
    )
  }
}
