import { txUtils } from 'decentraland-eth'
import { Mortgage } from '../src/Mortgage'
import { MORTGAGE_STATUS } from '../shared/mortgage'

const tableName = Mortgage.tableName
const mortgageStatus = Object.values(MORTGAGE_STATUS).map(val => `'${val}'`)

exports.up = pgm => {
  pgm.createTable(
    tableName,
    {
      tx_hash: { type: 'TEXT', primaryKey: true, unique: true, notNull: true },
      tx_status: {
        type: 'TEXT',
        notNull: true,
        default: txUtils.TRANSACTION_TYPES.pending
      },
      block_number: {
        type: 'INT',
        notNull: true
      },
      status: {
        type: 'TEXT',
        notNull: true,
        default: MORTGAGE_STATUS.ongoing,
        check: `status IN (${mortgageStatus})`
      },
      asset_id: { type: 'TEXT', notNull: true },
      type: 'TEXT',
      borrower: { type: 'VARCHAR(42)', notNull: true },
      lender: { type: 'VARCHAR(42)' },
      loan_id: { type: 'INT', notNull: true },
      mortgage_id: { type: 'INT', notNull: true },
      amount: { type: 'FLOAT', notNull: true },
      is_due_at: { type: 'BIGINT', notNull: true },
      expires_at: { type: 'BIGINT', notNull: true },
      block_time_created_at: { type: 'BIGINT' },
      block_time_updated_at: { type: 'BIGINT' },
      created_at: { type: 'TIMESTAMP', notNull: true },
      updated_at: 'TIMESTAMP'
    },
    { ifNotExists: true }
  )

  pgm.createIndex(tableName, 'tx_status')
  pgm.createIndex(tableName, 'mortgage_id')
  pgm.createIndex(tableName, 'status')
  pgm.createIndex(tableName, 'borrower')
  pgm.createIndex(tableName, 'asset_id')
}

exports.down = pgm => {
  pgm.dropIndex(tableName, 'tx_status')
  pgm.dropIndex(tableName, 'mortgage_id')
  pgm.dropIndex(tableName, 'status')
  pgm.dropIndex(tableName, 'borrower')
  pgm.dropIndex(tableName, 'asset_id')

  pgm.dropTable(tableName)
}
