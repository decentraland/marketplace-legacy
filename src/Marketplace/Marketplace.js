import { Publication, PublicationQueries, ListingQueries } from '../Listing'
import { Asset, EstateQueries } from '../Asset'
import { ApprovalQueries } from '../Approval'
import { db, SQL, raw } from '../database'

export class Marketplace {
  async filterAll(filters) {
    const { status, sort, pagination } = filters.sanitize()

    const [publications, total] = await Promise.all([
      db.query(
        SQL`SELECT asset_id, asset_type
          FROM ${raw(Publication.tableName)}
          WHERE ${ListingQueries.hasStatus(status)}
            AND ${PublicationQueries.isActive()}
            AND ${EstateQueries.estateHasParcels(Publication.tableName)}
          ORDER BY ${raw(sort.by)} ${raw(sort.order)}
          LIMIT ${raw(pagination.limit)} OFFSET ${raw(pagination.offset)}`
      ),
      this.countAssetPublications(filters)
    ])

    const assets = await Promise.all(
      publications.map(async publication => {
        const Model = Asset.getNew(publication.asset_type)
        const asset = await Model.findById(publication.asset_id)
        asset.publication = publication
        return asset
      })
    )

    return { assets, total }
  }

  async filter(queryParams, PublicableAsset) {
    const { status, asset_type, sort, pagination } = queryParams.sanitize()

    const [assets, total] = await Promise.all([
      db.query(
        SQL`SELECT assets.*,
            row_to_json(pub.*) as publication,
            ${ApprovalQueries.selectAssetApprovals(asset_type)}
          FROM ${raw(Publication.tableName)} as pub
          JOIN ${raw(
            PublicableAsset.tableName
          )} as assets ON assets.id = pub.asset_id
          WHERE ${PublicationQueries.hasAssetType(asset_type)}
            AND ${ListingQueries.hasStatus(status)}
            AND ${PublicationQueries.isActive()}
            AND ${EstateQueries.estateHasParcels('pub')}
          ORDER BY pub.${raw(sort.by)} ${raw(sort.order)}
          LIMIT ${raw(pagination.limit)} OFFSET ${raw(pagination.offset)}`
      ),
      this.countAssetPublications(queryParams)
    ])

    return { assets, total }
  }

  async countAssetPublications(queryParams) {
    const { status, asset_type } = queryParams.sanitize()

    const result = await db.query(
      SQL`SELECT COUNT(*)
        FROM ${raw(Publication.tableName)} as pub
        WHERE pub.status = ${status}
          AND ${PublicationQueries.hasAssetType(asset_type)}
          AND ${PublicationQueries.isActive()}
          AND ${EstateQueries.estateHasParcels('pub')}`
    )

    return parseInt(result[0].count, 10)
  }
}
