import { Mortgage } from '../src/Mortgage'

const tableName = Mortgage.tableName
const mortgageStatus = Object.values(Mortgage.STATUS)
  .map(val => `'${val}'`)
  .join(', ')

exports.up = pgm => {
  pgm.addColumns(tableName, {
    started_at: { type: 'TIMESTAMP' },
    amount_paid: { type: 'FLOAT', notNull: true, default: 0 },
    payable_at: { type: 'BIGINT', notNull: true }
  })

  // Remove checking status by db
  pgm.dropConstraint(tableName, 'mortgages_status_check')
}

exports.down = pgm => {
  pgm.dropColumns(tableName, {
    started_at: { type: 'TIMESTAMP' },
    amount_paid: { type: 'FLOAT' },
    payable_at: { type: 'BIGINT' }
  })

  pgm.addConstraint(
    tableName,
    'mortgages_status_check',
    `CHECK (status IN (${mortgageStatus}))`
  )
}
