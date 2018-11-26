import { Model } from 'decentraland-commons'
import { SQL } from '../database'

export class Invite extends Model {
  static tableName = 'decentraland_invites'
  static columnNames = ['address', 'invited']

  static createOrUpdate(address, invited) {
    return Invite.query(
      SQL`INSERT INTO ${SQL.raw(this.tableName)} (address, invited) 
          VALUES (${address}, ${invited})
          ON CONFLICT (address) DO UPDATE
          SET invited = EXCLUDED.invited`
    )
  }

  static async hasInvite(address) {
    const res = await this.findOne({ address: address, invited: true })
    return res !== undefined
  }
}
