import { Model } from 'decentraland-commons'

export class State extends Model {
  static tableName = 'states'
  static primaryKey = 'address'
  static columnNames = ['address', 'owner', 'data', 'last_transferred_at']
}
