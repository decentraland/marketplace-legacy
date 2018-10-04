import { PublicationQueries } from '../Publication'
import { db, SQL, raw } from '../database'

export class Asset {
  constructor(Model) {
    this.Model = Model
    this.tableName = Model.tableName
  }

  async findById(id) {
    const assets = await db.query(
      SQL`SELECT ${raw(this.tableName)}.*, (
        ${PublicationQueries.findLastAssetPublicationJsonSql(this.tableName)}
      ) as publication
        FROM ${raw(this.tableName)}
        WHERE id = ${id}
        LIMIT 1`
    )
    return assets[0]
  }

  async findByTokenId(tokenId) {
    const assets = await db.query(
      SQL`SELECT ${raw(this.tableName)}.*, (
        ${PublicationQueries.findLastAssetPublicationJsonSql(this.tableName)}
      ) as publication
        FROM ${raw(this.tableName)}
        WHERE token_id = ${tokenId}
        LIMIT 1`
    )
    return assets[0]
  }

  findByIds(ids) {
    if (ids.length === 0) return []

    return db.query(
      SQL`SELECT *, (
        ${PublicationQueries.findLastAssetPublicationJsonSql(this.tableName)}
      ) as publication
        FROM ${raw(this.tableName)}
        WHERE id = ANY(${ids})`
    )
  }

  findByTokenIds(tokenIds) {
    if (tokenIds.length === 0) return []

    return db.query(
      SQL`SELECT *, (
        ${PublicationQueries.findLastAssetPublicationJsonSql(this.tableName)}
      ) as publication
        FROM ${raw(this.tableName)}
        WHERE token_id = ANY(${tokenIds})`
    )
  }

  async findByOwner(owner) {
    return db.query(
      SQL`SELECT ${raw(this.tableName)}.*, (
        ${PublicationQueries.findLastAssetPublicationJsonSql(this.tableName)}
      ) as publication
        FROM ${raw(this.tableName)}
        WHERE owner = ${owner}`
    )
  }

  async findByOwnerAndStatus(owner, status) {
    return db.query(
      SQL`SELECT DISTINCT ON(asset.id, pub.status) asset.*, row_to_json(pub.*) as publication
        FROM ${raw(this.tableName)} as asset
        LEFT JOIN (
          ${PublicationQueries.findByStatusSql(status)}
        ) as pub ON asset.id = pub.asset_id
        WHERE asset.owner = ${owner}
          AND pub.tx_hash IS NOT NULL`
    )
  }

  async filter(queryParams) {
    const { sort, pagination } = queryParams.sanitize()

    const [assets, total] = await Promise.all([
      db.query(
        SQL`SELECT model.*
          FROM ${raw(this.tableName)} as model
          ORDER BY model.${raw(sort.by)} ${raw(sort.order)}
          LIMIT ${raw(pagination.limit)} OFFSET ${raw(pagination.offset)}`
      ),
      this.Model.count()
    ])

    return { assets, total }
  }
}
