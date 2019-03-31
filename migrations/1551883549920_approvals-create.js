import { Approval } from '../src/Approval'

const tableName = Approval.tableName

exports.up = pgm => {
  pgm.createTable(
    tableName,
    {
      token_address: { type: 'TEXT', notNull: true },
      owner: { type: 'TEXT', notNull: true },
      operator: { type: 'TEXT', notNull: true }
    },
    { ifNotExists: true }
  )

  pgm.createIndex(tableName, ['token_address', 'owner', 'operator'], {
    unique: true
  })
}
