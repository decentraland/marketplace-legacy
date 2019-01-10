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

  static findByOwner(owner) {
    return this.Model.find({ owner })
  }

  // TODO: Add asset_type
  async findByAssetId(asset_id) {
    return this.Model.find({ asset_id }, { created_at: 'DESC' })
  }

  // TODO: Add asset_type
  async findByAssetIdWithStatus(asset_id, status) {
    if (!this.isValidStatus(status)) {
      throw new Error(`Invalid status "${status}"`)
    }

    return this.find({ asset_id, status }, { created_at: 'DESC' })
  }

  // TODO: Add asset_type
  static deleteByAssetId(assetId) {
    return this.Model.delete({ asset_id: assetId })
  }
}
