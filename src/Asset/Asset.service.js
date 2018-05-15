import { txUtils } from 'decentraland-eth'

import { SQL, raw } from '../database'
import {
  Publication,
  PublicationQueries,
  PublicationService
} from '../Publication'
import { Parcel } from '../Parcel'

export class AssetService {
  constructor() {
    this.Publication = Publication
    this.Parcel = Parcel
  }

  async filter(filters) {
    const { status, type, sort, pagination } = filters.sanitize()
    const tx_status = txUtils.TRANSACTION_STATUS.confirmed

    const Model = new PublicationService().getModelFromType(type)

    const [assets, total] = await Promise.all([
      this.Publication.query(
        SQL`SELECT model.*, row_to_json(pub.*) as publication
          FROM ${raw(this.Publication.tableName)} as pub
          JOIN ${raw(Model.tableName)} as model ON model.asset_id = pub.asset_id
          WHERE status = ${status}
            AND tx_status = ${tx_status}
            AND type = ${type}
            AND ${PublicationQueries.whereisActive()}
          ORDER BY pub.${raw(sort.by)} ${raw(sort.order)}
          LIMIT ${raw(pagination.limit)} OFFSET ${raw(pagination.offset)}`
      ),
      this.countAssetPublications(filters, type)
    ])

    return { assets, total }
  }

  async countAssetPublications(filters) {
    const { status, type } = filters.sanitize()
    const tx_status = txUtils.TRANSACTION_STATUS.confirmed

    const counts = await this.Publication.query(
      SQL`SELECT COUNT(*)
          FROM ${raw(this.Publication.tableName)}
          WHERE status = ${status}
            AND tx_status = ${tx_status}
            AND type = ${type}
            AND ${PublicationQueries.whereisActive()}`
    )
    return parseInt(counts[0].count, 10)
  }
}
