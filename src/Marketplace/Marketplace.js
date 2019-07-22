import {
  Publication,
  PublicationQueries,
  Listing,
  ListingQueries
} from '../Listing'
import { EstateQueries } from '../Asset'
import { db, SQL, raw } from '../database'

export class Marketplace {
  async filterAll(filters) {
    const { status, sort, pagination } = filters.sanitize()

    const [assets, total] = await Promise.all([
      db.query(
        SQL`SELECT row_to_json(pub.*) as publication, ${ListingQueries.selectListableAssets()}
          FROM ${raw(Publication.tableName)} as pub
          ${ListingQueries.joinListableAssets('pub')}
          WHERE ${ListingQueries.hasStatus(status)}
            AND ${PublicationQueries.isActive()}
            AND ${EstateQueries.estateHasParcels('pub')}
          ORDER BY pub.${raw(sort.by)} ${raw(sort.order)}
          LIMIT ${raw(pagination.limit)} OFFSET ${raw(pagination.offset)}`
      ),
      this.countAssetPublications(filters)
    ])

    return {
      // Keep only the assets that had a publication defined from the Assets list
      assets: Listing.filterAssetsByModelAssets(assets),
      total
    }
  }

  async filter(queryParams, PublicableAsset) {
    const { status, asset_type, sort, pagination } = queryParams.sanitize()
    const [assets, total] = await Promise.all([
      db.query(
        SQL`SELECT assets.*, row_to_json(pub.*) as publication
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
