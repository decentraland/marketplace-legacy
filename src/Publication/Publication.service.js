import { txUtils } from 'decentraland-eth'

import { Publication } from './Publication'
import { Parcel } from '../Parcel'

export class PublicationService {
  constructor() {
    this.Publication = Publication
  }

  async filter(filters) {
    const { status, sort, pagination } = filters.sanitize()

    const values = [status, txUtils.TRANSACTION_STATUS.confirmed]

    const [publications, counts] = await Promise.all([
      this.Publication.query(
        `SELECT pub.*, row_to_json(par.*) as parcel
          FROM ${Publication.tableName} as pub
          JOIN ${Parcel.tableName} as par ON par.x = pub.x AND par.y = pub.y
          WHERE status = $1
            AND tx_status = $2
            AND expires_at >= EXTRACT(epoch from now()) * 1000
          ORDER BY pub.${sort.by} ${sort.order}
          LIMIT ${pagination.limit} OFFSET ${pagination.offset}`,
        values
      ),
      this.Publication.query(
        `SELECT COUNT(*)
          FROM ${Publication.tableName}
          WHERE status = $1
            AND tx_status = $2
            AND expires_at >= EXTRACT(epoch from now()) * 1000`,
        values
      )
    ])

    const total = parseInt(counts[0].count, 10)

    return {
      publications,
      total
    }
  }
}
