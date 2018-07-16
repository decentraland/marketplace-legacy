import { Mortgage } from '../src/Mortgage'

const tableName = Mortgage.tableName

exports.up = pgm => {
  pgm.dropColumn(tableName, 'started_at')

  pgm.addColumns(tableName, {
    interest_rate: { type: 'FLOAT', notNull: true },
    punitory_interest_rate: { type: 'FLOAT', notNull: true },
    paid: { type: 'FLOAT', default: 0 },
    started_at: { type: 'BIGINT' },
    dues_in: { type: 'BIGINT' }
  })
}

exports.down = pgm => {
  pgm.dropColumns(tableName, {
    interest_rate: { type: 'FLOAT' },
    punitory_interest_rate: { type: 'FLOAT' },
    paid: { type: 'FLOAT' },
    started_at: { type: 'BIGINT' },
    dues_in: { type: 'BIGINT' }
  })

  pgm.addColumns(tableName, {
    started_at: {
      type: 'TIMESTAMP'
    }
  })
}
