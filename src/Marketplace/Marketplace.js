import {
  Publication,
  PublicationQueries,
  PublicationService
} from '../Publication'
import { db, SQL, raw } from '../database'

export class Marketplace {
  async filterAll(filters) {
    const { status, sort, pagination } = filters.sanitize()
    const Assets = new PublicationService().getPublicableAssets()

    const selectAssetsSQL = Assets.map(
      ({ tableName }) => `row_to_json(${tableName}.*) as ${tableName}`
    ).join(', ')

    const joinAssetsSQL = Assets.map(
      ({ tableName }) =>
        `LEFT JOIN ${tableName} as ${tableName} ON ${tableName}.id = pub.asset_id`
    ).join('\n')

    let [assets, total] = await Promise.all([
      db.query(
        SQL`SELECT row_to_json(pub.*) as publication, ${raw(selectAssetsSQL)}
          FROM ${raw(Publication.tableName)} as pub
          ${raw(joinAssetsSQL)}
          WHERE ${PublicationQueries.hasStatus(status)}
            AND ${PublicationQueries.whereIsActive()}
            AND ${PublicationQueries.EstateHasParcels()}
          ORDER BY pub.${raw(sort.by)} ${raw(sort.order)}
          LIMIT ${raw(pagination.limit)} OFFSET ${raw(pagination.offset)}`
      ),
      this.countAllAssetPublications(filters)
    ])

    // Keep only the model that had a publication defined from the Assets list
    assets = assets.map(asset => {
      for (const Model of Assets) {
        if (asset[Model.tableName] != null) {
          Object.assign(asset, asset[Model.tableName])
        }
        delete asset[Model.tableName]
      }
      return asset
    })

    return { assets, total }
  }

  async filter(queryParams, PublicableAsset) {
    const { status, asset_type, sort, pagination } = queryParams.sanitize()
    const [assets, total] = await Promise.all([
      db.query(
        SQL`SELECT model.*, row_to_json(pub.*) as publication
          FROM ${raw(Publication.tableName)} as pub
          JOIN ${raw(
            PublicableAsset.tableName
          )} as model ON model.id = pub.asset_id
          WHERE ${PublicationQueries.hasAssetType(asset_type)}
            AND ${PublicationQueries.hasStatus(status)}
            AND ${PublicationQueries.whereIsActive()}
            AND ${PublicationQueries.EstateHasParcels()}
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
        FROM ${raw(Publication.tableName)} as pub
        WHERE pub.status = ${status}
          AND ${PublicationQueries.hasAssetType(asset_type)}
          AND ${PublicationQueries.whereIsActive()}
          AND ${PublicationQueries.EstateHasParcels()}`
    )

    return parseInt(counts[0].count, 10)
  }

  async countAllAssetPublications(queryParams) {
    const { status } = queryParams.sanitize()

    const counts = await db.query(
      SQL`SELECT COUNT(*)
        FROM ${raw(Publication.tableName)} as pub
        WHERE pub.status = ${status}
          AND ${PublicationQueries.whereIsActive()}
          AND ${PublicationQueries.EstateHasParcels()}`
    )

    return parseInt(counts[0].count, 10)
  }
}
