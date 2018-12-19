import { Model } from 'decentraland-commons'
import uuid from 'uuid'

import { isRoad, isPlaza } from '../../shared/district'

export class District extends Model {
  static tableName = 'districts'
  static columnNames = [
    'id',
    'name',
    'description',
    'link',
    'public',
    'parcel_count',
    'parcel_ids',
    'priority',
    'center',
    'disabled'
  ]

  static isRoad(id) {
    return isRoad(id)
  }

  static isPlaza(id) {
    return isPlaza(id)
  }

  static findEnabled() {
    return this.find({ disabled: false })
  }

  static findByName(name) {
    return this.findOne({ name })
  }

  static insert(project) {
    project.id = project.id || uuid.v4()
    return super.insert(project)
  }
}
