import { Publication } from '../src/Publication'
import { LISTING_STATUS } from '../shared/listing'

exports.up = pgm => {
  const tableName = Publication.tableName

  const publicationStatus = Object.values(LISTING_STATUS)
    .map(val => `'${val}'`)
    .join(', ')

  pgm.addColumns(tableName, {
    status: {
      type: 'TEXT',
      notNull: true,
      default: LISTING_STATUS.open,
      check: `status IN (${publicationStatus})`
    },
    buyer: {
      type: 'VARCHAR(42)'
    }
  })

  pgm.renameColumn(tableName, 'address', 'owner')
}
