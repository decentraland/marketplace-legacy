import { Publication } from '../src/Publication'

exports.up = pgm => {
  const tableName = Publication.tableName

  pgm.addColumns(tableName, {
    block_time_created_at: { type: 'BIGINT' },
    block_time_updated_at: { type: 'BIGINT' }
  })
}
