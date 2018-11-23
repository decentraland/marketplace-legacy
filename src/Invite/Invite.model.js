import { Model } from 'decentraland-commons'
import { SQL } from '../database'

export class Invite extends Model {
  static tableName = 'decentraland_invite'
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
    const res = await this.findByAddressAndStatus(address, true)
    return res !== undefined
  }

  static findByAddressAndStatus(address, invited) {
    return this.findOne({ address: address, invited: invited })
  }
}
