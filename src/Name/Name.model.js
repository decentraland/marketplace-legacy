import { Model } from 'decentraland-server'

export class Name extends Model {
  static tableName = 'names'
  static primaryKey = ''
  static columnNames = ['owner', 'user_id', 'username', 'metadata']
  static withTimestamps = false
}
