import { Model } from 'decentraland-commons'

import { SQL } from '../database'

export class Approval extends Model {
  static tableName = 'approvals'
  static columnNames = ['token_address', 'owner', 'operator']

  static async approveForAll(tokenAddress, owner, operator) {
    return this.db.query(
      SQL`INSERT INTO ${SQL.raw(
        this.tableName
      )} (token_address, owner, operator) 
          VALUES (${tokenAddress}, ${owner}, ${operator});`
    )
  }

  static async isApprovedForAll(tokenAddress, owner, operator) {
    const count = await this.count({
      token_address: tokenAddress,
      owner,
      operator
    })

    return count > 0
  }
}
