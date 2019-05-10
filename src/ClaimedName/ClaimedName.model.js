import { Model } from 'decentraland-server'

export class ClaimedName extends Model {
  static tableName = 'claimed_names'
  static primaryKey = ''
  static columnNames = ['owner', 'user_id', 'username', 'metadata']
  static withTimestamps = false
}
