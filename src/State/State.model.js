import { Model } from 'decentraland-commons'

import { Asset } from '../Asset'

export class State extends Model {
  static tableName = 'states'
  static primaryKey = 'address'
  static columnNames = ['address', 'owner', 'data', 'last_transferred_at']

  static async findByOwner(owner) {
    return new Asset(this).findByOwner(owner)
  }

  static async findByOwnerAndStatus(owner, status) {
    return new Asset(this).findByOwnerAndStatus(owner, status)
  }
}
