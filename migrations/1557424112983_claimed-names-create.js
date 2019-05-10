import { ClaimedName } from '../src/ClaimedName'

const tableName = ClaimedName.tableName

exports.up = pgm => {
  pgm.createTable(
    tableName,
    {
      owner: { type: 'TEXT', notNull: true },
      user_id: { type: 'TEXT', notNull: false }, // Not null because is not clear how it will be defined yet
      username: { type: 'TEXT', notNull: true },
      metadata: { type: 'TEXT', notNull: false }
    },
    { ifNotExists: true }
  )

  pgm.createIndex(tableName, ['owner'], {
    unique: true
  })
}
