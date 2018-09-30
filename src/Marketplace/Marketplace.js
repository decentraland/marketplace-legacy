import { Parcel } from '../Parcel'
import { Estate } from '../Estate'
import { Publication, PublicationQueries } from '../Publication'
import { db, SQL, raw } from '../database'

export class Marketplace {
  async filter(queryParams, PublicableModel) {
    const { status, asset_type, sort, pagination } = queryParams.sanitize()

    const [assets, total] = await Promise.all([
      db.query(
        SQL`SELECT model.*, row_to_json(pub.*) as publication
          FROM ${raw(Publication.tableName)} as pub
          JOIN ${raw(
            PublicableModel.tableName
          )} as model ON model.id = pub.asset_id
          WHERE ${PublicationQueries.hasAssetType(asset_type)}
            AND ${PublicationQueries.hasStatus(status)}
            AND ${PublicationQueries.whereIsActive()}
          ORDER BY pub.${raw(sort.by)} ${raw(sort.order)}
          LIMIT ${raw(pagination.limit)} OFFSET ${raw(pagination.offset)}`
      ),
      this.countAssetPublications(queryParams)
    ])

    return { assets, total }
  }

  async countAssetPublications(queryParams) {
    const { status, asset_type } = queryParams.sanitize()

    const counts = await db.query(
      SQL`SELECT COUNT(*)
        FROM ${raw(Publication.tableName)}
        WHERE status = ${status}
          AND ${PublicationQueries.hasAssetType(asset_type)}
          AND ${PublicationQueries.whereIsActive()}`
    )

    return parseInt(counts[0].count, 10)
  }
}
