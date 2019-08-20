import { AssetQueries } from './Asset.queries'
import { ApprovalQueries } from '../Approval'
import { PublicationQueries } from '../Listing'
import { db, SQL, raw } from '../database'
import { ASSETS } from '.'

// TODO: The concept of this class might be a bit flawed.
// While it's useful to have an abstraction for asset calls, it works differently from all of the other Models.
// The models have instance methods you can call supplying an object representing the model to the constructor:
//   const parcel = new Parcel({ x, y, estate_id, (...) })
//   parcel.insert()
// but Asset receives a Model and each instance method uses it to get the tableName and assetType.
// Maybe we can have an interface where:
//   const parcelAttributes = { id, x, y, type }
//   const asset = new Asset(parcel)
//   asset.insert() // knows it's a parcel
//   (...)
//   Asset.findById(id, type)
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

    for (const assetType in ASSETS) {
      if (Model === ASSETS[assetType]) {
        this.assetType = assetType
        break
      }
    }

    if (!this.assetType) {
      throw new Error(`Invalid Model "${Model}"`)
    }
  }

  async findById(id) {
    const assets = await db.query(
      SQL`SELECT *, (
        ${PublicationQueries.findLastAssetPublicationJsonSql('assets')}
      ) as publication, ${ApprovalQueries.selectAssetApprovals(this.assetType)}
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
      ) as publication, ${ApprovalQueries.selectAssetApprovals(this.assetType)}
        FROM ${raw(this.tableName)} assets
        WHERE token_id = ${tokenId}
        LIMIT 1`
    )
    return assets[0]
  }

  async findByTokenIds(tokenIds) {
    if (tokenIds.length === 0) return []

    return db.query(
      SQL`SELECT *, (
        ${PublicationQueries.findLastAssetPublicationJsonSql('assets')}
      ) as publication, ${ApprovalQueries.selectAssetApprovals(this.assetType)}
        FROM ${raw(this.tableName)} assets
        WHERE token_id = ANY(${tokenIds})`
    )
  }

  async findByOwner(owner) {
    return db.query(
      SQL`SELECT assets.*, (
        ${PublicationQueries.findLastAssetPublicationJsonSql('assets')}
      ) as publication, ${ApprovalQueries.selectAssetApprovals(this.assetType)}
        FROM ${raw(this.tableName)} assets
        WHERE ${AssetQueries.canAccessAsset(owner)}`
    )
  }

  async findByOwnerAndStatus(owner, status) {
    return db.query(
      // prettier-ignore
      SQL`SELECT DISTINCT ON(assets.id, pub.status) assets.*,
          row_to_json(pub.*) as publication,
          ${ApprovalQueries.selectAssetApprovals(this.assetType)}
        FROM ${raw(this.tableName)} as assets
        LEFT JOIN (${PublicationQueries.findByStatusSql(status)}) as pub ON assets.id = pub.asset_id
        WHERE ${AssetQueries.canAccessAsset(owner)}
        AND pub.tx_hash IS NOT NULL`
    )
  }

  async findApprovals(id) {
    const approvalRows = await db.query(
      SQL`SELECT assets.operator, assets.update_operator, ${ApprovalQueries.selectAssetApprovals(
        this.assetType
      )}
        FROM ${raw(this.tableName)} assets
        WHERE assets.id = ${id}
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
