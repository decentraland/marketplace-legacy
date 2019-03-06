import { Model } from 'decentraland-commons'

import { SQL } from '../database'

export class Approval extends Model {
  static tableName = 'approvals'
  static columnNames = ['token_address', 'owner', 'operator']

  static async insertApproval(tokenAddress, owner, operator) {
    return this.db.query(
      SQL`INSERT INTO ${SQL.raw(
        this.tableName
      )} (token_address, owner, operator) 
          VALUES (${tokenAddress.toLowerCase()}, ${owner.toLowerCase()}, ${operator.toLowerCase()});`
    )
  }

  static async isApprovedForAll(tokenAddress, owner, operator) {
    const res = await this.findOne({
      token_address: tokenAddress,
      owner,
      operator
    })
    return res !== undefined
  }
}
