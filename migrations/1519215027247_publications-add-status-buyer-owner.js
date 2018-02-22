import { Publication } from '../src/Publication'

exports.up = pgm => {
  const tableName = Publication.tableName
  const publicationStatus = Object.values(Publication.STATUS)
    .map(val => `'${val}'`)
    .join(', ')

  pgm.addColumns(tableName, {
    status: {
      type: 'text',
      notNull: true,
      default: Publication.STATUS.open,
      check: `status IN (${publicationStatus})`
    },
    buyer: {
      type: 'text'
    }
  })

  pgm.renameColumn(tableName, 'address', 'owner')
}
