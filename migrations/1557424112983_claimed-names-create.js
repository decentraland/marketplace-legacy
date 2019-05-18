import { ClaimedName } from '../src/ClaimedName'

const tableName = ClaimedName.tableName

exports.up = pgm => {
  pgm.createTable(
    tableName,
    {
      owner: { type: 'TEXT', notNull: true },
      username: { type: 'TEXT', notNull: true },
      metadata: { type: 'TEXT', notNull: false }
    },
    { ifNotExists: true }
  )

  pgm.createIndex(tableName, ['owner'], {
    unique: true
  })
}
