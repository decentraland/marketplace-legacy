import { txUtils } from 'decentraland-eth'

import { SQL, raw } from '../database'
import { Publication } from './Publication.model'
import { PublicationQueries } from './Publication.queries'
import { Parcel } from '../Parcel'

export class PublicationService {
  constructor() {
    this.Publication = Publication
  }

  async filter(filters, type) {
    const { status, sort, pagination } = filters.sanitize()
    const tx_status = txUtils.TRANSACTION_STATUS.confirmed

    const [publications, counts] = await Promise.all([
      this.Publication.query(
        SQL`SELECT pub.*, row_to_json(par.*) as parcel
          FROM ${raw(Publication.tableName)} as pub
          JOIN ${raw(Parcel.tableName)} as par ON par.asset_id = pub.asset_id
          WHERE status = ${status}
            AND tx_status = ${tx_status}
            AND type = ${type}
            AND ${PublicationQueries.whereisActive()}
          ORDER BY pub.${raw(sort.by)} ${raw(sort.order)}
          LIMIT ${raw(pagination.limit)} OFFSET ${raw(pagination.offset)}`
      ),
      this.Publication.query(
        SQL`SELECT COUNT(*)
          FROM ${raw(Publication.tableName)}
          WHERE status = ${status}
            AND tx_status = ${tx_status}
            AND type = ${type}
            AND ${PublicationQueries.whereisActive()}`
      )
    ])

    const total = parseInt(counts[0].count, 10)

    return { publications, total }
  }
}
