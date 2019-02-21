import { Estate } from '../src/Asset'

exports.up = pgm => {
  const tableName = Estate.tableName

  pgm.addColumns(tableName, {
    district_id: 'TEXT'
  })
}
