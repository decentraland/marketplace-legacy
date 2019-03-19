import { ListingQueries } from './Listing.queries'
import { SQL, raw, db } from '../database'
import { Asset } from '../Asset'
import { LISTING_STATUS, LISTING_ASSET_TYPES } from '../shared/listing'

export class Listing {
  constructor(Model) {
    this.Model = Model
    this.tableName = Model.tableName
  }

  static isValidStatus(status) {
    return Object.values(LISTING_STATUS).includes(status)
  }

  static isValidAssetType(assetType) {
    return Object.values(LISTING_ASSET_TYPES).includes(assetType)
  }

  static getListableAsset(assetType) {
    if (!Listing.isValidAssetType(assetType)) {
      throw new Error(`Invalid publication asset_type "${assetType}"`)
    }

    return Asset.getModel(assetType)
  }

  static getListableAssets() {
    const listableAsset = {}

    for (const key in LISTING_ASSET_TYPES) {
      listableAsset[key] = Asset.getModel(key)
    }

    return Object.values(listableAsset)
  }

  static filterAssetsByModelAssets(assets) {
    const Assets = Listing.getListableAssets()
    return assets.map(asset => {
      for (const Model of Assets) {
        if (asset[Model.tableName] != null) {
          Object.assign(asset, asset[Model.tableName])
        }
        delete asset[Model.tableName]
      }
      return asset
    })
  }

  async findByOwner(owner) {
    return this.Model.find({ owner })
  }

  async updateExpired() {
    return db.query(SQL`
      UPDATE ${raw(this.tableName)}
        SET updated_at = NOW(),
            status = ${LISTING_STATUS.expired}
      WHERE ${ListingQueries.isInactive()}
        AND ${ListingQueries.hasStatuses([
          LISTING_STATUS.open,
          LISTING_STATUS.fingerprintChanged
        ])}`)
  }

  async findByAssetId(asset_id, asset_type) {
    return this.Model.find({ asset_id, asset_type }, { created_at: 'DESC' })
  }

  async findByAssetIdWithStatus(asset_id, asset_type, status) {
    if (!Listing.isValidStatus(status)) {
      throw new Error(`Invalid status "${status}"`)
    }

    return this.Model.find(
      { asset_id, asset_type, status },
      { created_at: 'DESC' }
    )
  }

  // TODO: Add asset_type
  async deleteByAssetId(asset_id) {
    return this.Model.delete({ asset_id })
  }
}
