import { Publication } from '../src/Publication'
import { PUBLICATION_STATUS } from '../shared/publication'

exports.up = pgm => {
  const tableName = Publication.tableName

  const publicationStatus = Object.values(PUBLICATION_STATUS)
    .map(val => `'${val}'`)
    .join(', ')

  pgm.addColumns(tableName, {
    status: {
      type: 'TEXT',
      notNull: true,
      default: PUBLICATION_STATUS.open,
      check: `status IN (${publicationStatus})`
    },
    buyer: {
      type: 'VARCHAR(42)'
    }
  })

  pgm.renameColumn(tableName, 'address', 'owner')
}
