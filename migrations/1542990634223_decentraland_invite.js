import { Invite } from '../src/Invite'

const tableName = Invite.tableName

exports.up = pgm => {
  pgm.createTable(
    tableName,
    {
      address: { type: 'TEXT', primaryKey: true, notNull: true },
      invited: { type: 'BOOLEAN', notNull: true, default: false }
    },
    { ifNotExists: true }
  )
}

exports.down = pgm => {
  pgm.dropTable(tableName)
}
