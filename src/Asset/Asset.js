import { PublicationQueries } from '../Listing'
import { db, SQL, raw } from '../database'
import { APPROVAL_TYPES } from '../shared/approval'
import { ASSETS } from '.'

export class Asset {
  static getNew(assetType) {
    const Model = this.getModel(assetType)
    return new Asset(Model)
  }

  static getModel(assetType) {
    if (!ASSETS[assetType]) {
      throw new Error(`Invalid asset type "${assetType}"`)
    }
    return ASSETS[assetType]
  }

  constructor(Model) {
    this.Model = Model
    this.tableName = Model.tableName
  }

  async findById(id) {
    // prettier-ignore
    const rolesSQL = SQL`
      (SELECT array(SELECT operator FROM approvals a WHERE a.owner = asset.owner AND a.type = ${APPROVAL_TYPES.manager})) as update_managers,
      (SELECT array(SELECT operator FROM approvals a WHERE a.owner = asset.owner AND a.type = ${APPROVAL_TYPES.operator})) as operators_for_all
    `

    const assets = await db.query(
      SQL`SELECT *, (
        ${PublicationQueries.findLastAssetPublicationJsonSql('asset')}
      ) as publication, ${rolesSQL}
        FROM ${raw(this.tableName)} asset
        WHERE id = ${id}
        LIMIT 1`
    )
    return assets[0]
  }

  async findByTokenId(tokenId) {
    // prettier-ignore
    const rolesSQL = SQL`
      (SELECT array(SELECT operator FROM approvals a WHERE a.owner = asset.owner AND a.type = ${APPROVAL_TYPES.manager})) as update_managers,
      (SELECT array(SELECT operator FROM approvals a WHERE a.owner = asset.owner AND a.type = ${APPROVAL_TYPES.operator})) as operators_for_all
    `

    const assets = await db.query(
      SQL`SELECT *, (
        ${PublicationQueries.findLastAssetPublicationJsonSql('asset')}
      ) as publication, ${rolesSQL}
        FROM ${raw(this.tableName)} asset
        WHERE token_id = ${tokenId}
        LIMIT 1`
    )
    return assets[0]
  }

  findByTokenIds(tokenIds) {
    if (tokenIds.length === 0) return []

    // prettier-ignore
    const rolesSQL = SQL`
      (SELECT array(SELECT operator FROM approvals a WHERE a.owner = asset.owner AND a.type = ${APPROVAL_TYPES.manager})) as update_managers,
      (SELECT array(SELECT operator FROM approvals a WHERE a.owner = asset.owner AND a.type = ${APPROVAL_TYPES.operator})) as operators_for_all
    `

    return db.query(
      SQL`SELECT *, (
        ${PublicationQueries.findLastAssetPublicationJsonSql('asset')}
      ) as publication, ${rolesSQL}
        FROM ${raw(this.tableName)} asset
        WHERE token_id = ANY(${tokenIds})`
    )
  }

  async findByOwner(owner) {
    // TODO: Extract. Use APPROVAL_TYPES on rolesSQL

    // prettier-ignore
    const isAssetOwnerSQL = SQL`(
      asset.owner = ${owner}
        OR asset.operator = ${owner}
        OR EXISTS (SELECT 1 FROM approvals a WHERE a.owner = asset.owner AND a.operator = ${owner} AND a.type = ANY(${Object.values(APPROVAL_TYPES)}) LIMIT 1)
    )`

    // prettier-ignore
    const rolesSQL = SQL`
      (SELECT array(SELECT operator FROM approvals a WHERE a.owner = asset.owner AND a.type = ${APPROVAL_TYPES.manager})) as update_managers,
      (SELECT array(SELECT operator FROM approvals a WHERE a.owner = asset.owner AND a.type = ${APPROVAL_TYPES.operator})) as operators_for_all
    `

    return db.query(
      SQL`SELECT asset.*, (
        ${PublicationQueries.findLastAssetPublicationJsonSql('asset')}
      ) as publication, ${rolesSQL}
        FROM ${raw(this.tableName)} asset
        WHERE ${isAssetOwnerSQL}`
    )
  }

  async findByOwnerAndStatus(owner, status) {
    // prettier-ignore
    const isAssetOwnerSQL = SQL`(
      asset.owner = ${owner}
        OR asset.operator = ${owner}
        OR EXISTS (SELECT 1 FROM approvals a WHERE a.owner = asset.owner AND a.operator = ${owner} AND a.type = ANY(${Object.values(APPROVAL_TYPES)}) LIMIT 1)
    )`

    // prettier-ignore
    const rolesSQL = SQL`
      (SELECT array(SELECT operator FROM approvals a WHERE a.owner = asset.owner AND a.type = ${APPROVAL_TYPES.manager})) as update_managers,
      (SELECT array(SELECT operator FROM approvals a WHERE a.owner = asset.owner AND a.type = ${APPROVAL_TYPES.operator})) as operators_for_all
    `

    return db.query(
      // prettier-ignore
      SQL`SELECT DISTINCT ON(asset.id, pub.status) asset.*, row_to_json(pub.*) as publication, ${rolesSQL}
        FROM ${raw(this.tableName)} as asset
        LEFT JOIN (${PublicationQueries.findByStatusSql(status)}) as pub ON asset.id = pub.asset_id
        WHERE ${isAssetOwnerSQL}
        AND pub.tx_hash IS NOT NULL`
    )
  }

  async filter(queryParams) {
    const { sort, pagination } = queryParams.sanitize()

    const [assets, total] = await Promise.all([
      db.query(
        SQL`SELECT *
          FROM ${raw(this.tableName)}
          ORDER BY ${raw(sort.by)} ${raw(sort.order)}
          LIMIT ${raw(pagination.limit)} OFFSET ${raw(pagination.offset)}`
      ),
      this.Model.count()
    ])

    return { assets, total }
  }
}
