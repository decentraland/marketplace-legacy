import { Model } from 'decentraland-commons'

import { Asset } from '../Asset'

export class Estate extends Model {
  static tableName = 'estates'
  static columnNames = [
    'id',
    'tx_hash',
    'asset_id',
    'owner',
    'data',
    'last_transferred_at'
  ]

  static findByOwner(owner) {
    return new Asset(this).findByOwner(owner)
  }

  static findByOwnerAndStatus(owner, status) {
    return new Asset(this).findByOwnerAndStatus(owner, status)
  }

  static findByAssetId(assetId) {
    return new Asset(this).findByAssetId(assetId)
  }

  static findByAssetIds(assetIds) {
    return new Asset(this).findByAssetIds(assetIds)
  }
}
