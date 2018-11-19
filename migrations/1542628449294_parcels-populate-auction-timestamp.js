import { FIRST_AUCTION_DATE } from '../shared/parcel'
import { Parcel } from '../src/Asset'

exports.up = pgm => {
  const tableName = Parcel.tableName

  pgm.db.query(
    `UPDATE ${tableName} SET auction_timestamp = ${FIRST_AUCTION_DATE.getTime()} where auction_owner IS NOT NULL AND auction_price IS NOT NULL;`
  )
}
