import { Model } from 'decentraland-commons'

import { Asset } from '../Asset'
import { ParcelAttributes } from '../Parcel'
import { Publication } from '../Publication'

export interface EstateAttributes {
  id: string
  owner: string
  data: ParcelAttributes['data']
  last_transfered_at: number
  publication?: Publication
  created_at?: Date
  updated_at?: Date
}

export class Estate extends Model {
  static tableName = 'estates'
  static columnNames = ['id', 'owner', 'data', 'last_transferred_at']

  static async findByOwner(owner: string): Promise<EstateAttributes[]> {
    return new Asset(this).findByOwner(owner)
  }

  static async findByOwnerAndStatus(
    owner: string,
    status: string
  ): Promise<EstateAttributes[]> {
    return new Asset(this).findByOwnerAndStatus(owner, status)
  }
}
