import { Model } from 'decentraland-server'

export class Approval extends Model {
  static tableName = 'approvals'
  static columnNames = ['type', 'token_address', 'owner', 'operator']
  static withTimestamps = false
}
