import { Model } from 'decentraland-commons'

import { SQL, raw, getInStatus } from '../database'
import { MortgageQueries } from './Mortgage.queries'

export class Mortgage extends Model {
  static tableName = 'mortgages'
  static columnNames = [
    'tx_hash',
    'tx_status',
    'block_number',
    'status',
    'asset_id',
    'type',
    'borrower',
    'lender',
    'loan_id',
    'mortgage_id',
    'amount',
    'expires_at',
    'is_due_at',
    'payable_at',
    'started_at',
    'block_time_created_at',
    'block_time_updated_at'
  ]
  static primaryKey = 'tx_hash'

  static STATUS = Object.freeze({
    open: 'open',
    claimed: 'claimed',
    cancelled: 'cancelled',
    started: 'started'
  })

  static findByBorrower(borrower, status) {
    return this.db.query(
      SQL`SELECT * FROM ${raw(this.tableName)} as m, COALESCE(${raw(
        MortgageQueries.existPublication
      )}, 0) as hasOpenPublication
        WHERE borrower = ${borrower}
          AND status IN (${raw(getInStatus(status, this.STATUS))})
        ORDER BY created_at DESC`
    )
  }

  static findInCoordinate(assetId, status) {
    return this.db.query(
      SQL`SELECT * FROM ${raw(this.tableName)} as m, COALESCE(${raw(
        MortgageQueries.existPublication
      )}, 0) as has_open_publication
        WHERE asset_id = ${assetId}
          AND status IN(${raw(getInStatus(status, this.STATUS))})
        ORDER BY created_at DESC`
    )
  }
}
