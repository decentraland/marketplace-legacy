import { AssetQueries } from './Asset.queries'
import { ApprovalQueries } from '../Approval'
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
    const assets = await db.query(
      SQL`SELECT *, (
        ${PublicationQueries.findLastAssetPublicationJsonSql('assets')}
      ) as publication, ${ApprovalQueries.selectAssetApprovals()}
        FROM ${raw(this.tableName)} assets
        WHERE id = ${id}
        LIMIT 1`
    )
    return assets[0]
  }

  async findByTokenId(tokenId) {
    const assets = await db.query(
      SQL`SELECT *, (
        ${PublicationQueries.findLastAssetPublicationJsonSql('assets')}
      ) as publication, ${ApprovalQueries.selectAssetApprovals()}
        FROM ${raw(this.tableName)} assets
        WHERE token_id = ${tokenId}
        LIMIT 1`
    )
    return assets[0]
  }

  findByTokenIds(tokenIds) {
    if (tokenIds.length === 0) return []

    return db.query(
      SQL`SELECT *, (
        ${PublicationQueries.findLastAssetPublicationJsonSql('assets')}
      ) as publication, ${ApprovalQueries.selectAssetApprovals()}
        FROM ${raw(this.tableName)} assets
        WHERE token_id = ANY(${tokenIds})`
    )
  }

  async findByOwner(owner) {
    return db.query(
      SQL`SELECT assets.*, (
        ${PublicationQueries.findLastAssetPublicationJsonSql('assets')}
      ) as publication, ${ApprovalQueries.selectAssetApprovals()}
        FROM ${raw(this.tableName)} assets
        WHERE ${AssetQueries.canAccessAsset(owner)}`
    )
  }

  async findByOwnerAndStatus(owner, status) {
    return db.query(
      // prettier-ignore
      SQL`SELECT DISTINCT ON(assets.id, pub.status) assets.*,
          row_to_json(pub.*) as publication,
          ${ApprovalQueries.selectAssetApprovals()}
        FROM ${raw(this.tableName)} as assets
        LEFT JOIN (${PublicationQueries.findByStatusSql(status)}) as pub ON assets.id = pub.asset_id
        WHERE ${AssetQueries.canAccessAsset(owner)}
        AND pub.tx_hash IS NOT NULL`
    )
  }

  async findApprovals(assetId, assetType) {
    const approvalRows = await db.query(
      SQL`SELECT assets.operator, assets.update_operator, ${ApprovalQueries.selectAssetApprovals()}
        FROM ${raw(this.tableName)} assets
        WHERE assets.id = ${assetId}
        LIMIT 1`
    )
    return approvalRows[0]
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
