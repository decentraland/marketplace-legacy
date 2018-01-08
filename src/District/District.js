import { Model } from 'decentraland-commons'
import uuid from 'uuid'

class District extends Model {
  static tableName = 'districts'
  static columnNames = [
    'id',
    'name',
    'description',
    'link',
    'public',
    'parcels',
    'priority',
    'disabled',
    'center'
  ]

  static findByName(name) {
    return this.findOne({ name })
  }

  static insert(project) {
    project.id = project.id || uuid.v4()
    return super.insert(project)
  }
}

export default District
