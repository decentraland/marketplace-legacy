import { Mortgage } from '../src/Mortgage'

const tableName = Mortgage.tableName

exports.up = pgm => {
  pgm.addColumns(tableName, {
    started_at: { type: 'TIMESTAMP' },
    amount_paid: { type: 'FLOAT', notNull: true, default: 0 },
    payable_at: { type: 'BIGINT', notNull: true }
  })
}

exports.down = pgm => {
  pgm.dropColumns(tableName, {
    started_at: { type: 'TIMESTAMP' },
    amount_paid: { type: 'FLOAT' },
    payable_at: { type: 'BIGINT' }
  })
}
