import { txUtils } from 'decentraland-commons'

import { Publication } from './Publication'

export class PublicationService {
  constructor() {
    this.Publication = Publication
  }

  filter(filters) {
    const { sort, pagination } = filters.sanitize() // sanitizes the data

    const isSold = false
    const txStatus = txUtils.TRANSACTION_STATUS.confirmed

    return this.Publication.db.query(
      `SELECT *
        FROM ${this.Publication.tableName}
        WHERE is_sold = $1 AND
          tx_status = $2
        ORDER BY ${sort.by} ${sort.order}
        LIMIT $3 OFFSET $4`,
      [isSold, txStatus, pagination.limit, pagination.offset]
    )
  }
}
