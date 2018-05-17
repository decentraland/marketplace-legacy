import { Model } from 'decentraland-commons'
import { txUtils } from 'decentraland-eth'

import { Publication, PublicationQueries } from '../Publication'
import { db, SQL, raw } from '../database'
import { PublicationRequestFilters } from '../Publication/PublicationRequestFilters'

export class Asset {
  Model: Model
  tableName: string

  constructor(Model) {
    this.Model = Model
    this.tableName = Model.tableName
  }

  async findByOwner(owner: string) {
    return await db.query(SQL`SELECT ${SQL.raw(this.tableName)}.*, (
        ${PublicationQueries.findLastParcelPublicationJsonSql()}
      ) as publication
        FROM ${SQL.raw(this.tableName)}
        WHERE owner = ${owner}`)
  }

  async findByOwnerAndStatus(owner: string, status: string) {
    return await db.query(SQL`SELECT DISTINCT ON(asset.id, pub.status) asset.*, row_to_json(pub.*) as publication
        FROM ${SQL.raw(this.tableName)} as asset
        LEFT JOIN (
          ${PublicationQueries.findByStatusSql(status)}
        ) as pub ON asset.id = pub.asset_id
        WHERE asset.owner = ${owner}
          AND pub.tx_hash IS NOT NULL`)
  }

  // TODO: ParcelAttributes, StateAttributes return value
  // TODO: Sanitizable interface
  async filter(
    filters: PublicationRequestFilters
  ): Promise<{ assets: any[]; total: number }> {
    const { status, type, sort, pagination } = filters.sanitize()
    const tx_status = txUtils.TRANSACTION_STATUS.confirmed

    const [assets, total] = await Promise.all([
      db.query(
        SQL`SELECT model.*, row_to_json(pub.*) as publication
          FROM ${raw(Publication.tableName)} as pub
          JOIN ${raw(this.tableName)} as model ON model.id = pub.asset_id
          WHERE status = ${status}
            AND tx_status = ${tx_status}
            AND type = ${type}
            AND ${PublicationQueries.whereisActive()}
          ORDER BY pub.${raw(sort.by)} ${raw(sort.order)}
          LIMIT ${raw(pagination.limit)} OFFSET ${raw(pagination.offset)}`
      ),
      this.countAssetPublications(filters)
    ])

    return { assets, total }
  }

  async countAssetPublications(
    filters: PublicationRequestFilters
  ): Promise<number> {
    const { status, type } = filters.sanitize()
    const tx_status = txUtils.TRANSACTION_STATUS.confirmed

    const counts = await db.query(SQL`SELECT COUNT(*)
          FROM ${raw(Publication.tableName)}
          WHERE status = ${status}
            AND tx_status = ${tx_status}
            AND type = ${type}
            AND ${PublicationQueries.whereisActive()}`)

    return parseInt(counts[0].count, 10)
  }
}
