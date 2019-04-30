import { APPROVAL_TYPES } from '../shared/approval'
import { Approval } from '../src/Approval'

const tableName = Approval.tableName

exports.up = pgm => {
  pgm.addColumns(tableName, {
    type: { type: 'TEXT' }
  })

  pgm.sql(`UPDATE ${tableName} SET type = "${APPROVAL_TYPES.operator}";`)

  pgm.dropIndex(tableName, ['token_address', 'owner', 'operator'], {
    unique: true
  })
  pgm.createIndex(tableName, ['type', 'token_address', 'owner', 'operator'], {
    unique: true
  })
}

exports.down = pgm => {
  pgm.dropColumns(tableName, ['type'])

  pgm.dropIndex(tableName, ['type', 'token_address', 'owner', 'operator'], {
    unique: true
  })
  pgm.createIndex(tableName, ['token_address', 'owner', 'operator'], {
    unique: true
  })
}
