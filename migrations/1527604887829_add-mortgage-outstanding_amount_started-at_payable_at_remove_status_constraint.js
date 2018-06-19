import { Mortgage } from '../src/Mortgage'
import { MORTGAGES_STATUS } from '../shared/mortgage'

const tableName = Mortgage.tableName
const mortgageStatus = Object.values(MORTGAGES_STATUS)
  .map(val => `'${val}'`)
  .join(', ')

exports.up = pgm => {
  pgm.addColumns(tableName, {
    started_at: { type: 'TIMESTAMP' },
    outstanding_amount: { type: 'FLOAT', notNull: true },
    payable_at: { type: 'BIGINT', notNull: true }
  })

  pgm.createIndex(tableName, 'loan_id')
  // Remove checking status by db
  pgm.dropConstraint(tableName, 'mortgages_status_check')
}

exports.down = pgm => {
  pgm.dropColumns(tableName, {
    started_at: { type: 'TIMESTAMP' },
    outstanding_amount: { type: 'FLOAT' },
    payable_at: { type: 'BIGINT' }
  })

  pgm.dropIndex(tableName, 'loan_id')

  pgm.addConstraint(
    tableName,
    'mortgages_status_check',
    `CHECK (status IN (${mortgageStatus}))`
  )
}
