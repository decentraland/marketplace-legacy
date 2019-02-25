import { Publication } from '../src/Listing'
import { LISTING_STATUS } from '../shared/listing'

exports.up = pgm => {
  pgm.dropConstraint(Publication.tableName, 'publications_status_check')
}

exports.down = pgm => {
  const listingStatus = Object.values(LISTING_STATUS)
    .map(val => `'${val}'`)
    .join(', ')

  pgm.addConstraint(
    Publication.tableName,
    'publications_status_check',
    `CHECK (status IN (${listingStatus}))`
  )
}
