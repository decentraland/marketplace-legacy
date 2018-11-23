import { Model } from 'decentraland-commons'

export class Invite extends Model {
  static tableName = 'decentraland_invite'
  static columnNames = ['address', 'invited']

  static createOrUpdate(address, invited) {
    return this.db.query(
      SQL`INSERT INTO ${SQL.raw(this.tableName)} (address, invited) 
          VALUES (${address.toUpperCase()}, ${invited})
          ON CONFLICT (address) DO UPDATE
          SET invited = EXCLUDED.invited`
    )
  }

  static hasInvite(address) {
    return this.findOne({ address: address, invited: true })
  }
}
