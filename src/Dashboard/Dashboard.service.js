import { txUtils } from 'decentraland-eth'
import { Model } from 'decentraland-commons'

import { BlockchainEvent } from '../BlockchainEvent'
import { Contribution } from '../Contribution'
import { Parcel } from '../Parcel'
import { Publication } from '../Publication'

export class DashboardService {
  constructor() {
    this.db = Model.db
    this.BlockchainEvent = BlockchainEvent
    this.Contribution = Contribution
    this.Parcel = Parcel
    this.Publication = Publication
  }

  async fetchStats() {
    const [
      landOwnersCount,
      activeUsersCount,
      totalLandTraded,
      totalLandOnSale
    ] = await Promise.all([
      this.countLandOwners(),
      this.countActiveUsers(),
      this.countTotalLandTraded(),
      this.countTotalLandOnSale()
    ])

    return {
      landOwnersCount,
      activeUsersCount,
      totalLandTraded,
      totalLandOnSale
    }
  }

  async countLandOwners() {
    return await this.count(
      `SELECT COUNT(DISTINCT(A.owner)) 
        FROM (
          SELECT owner 
            FROM ${this.Parcel.tableName} 
            WHERE owner IS NOT NULL 
          UNION 
          SELECT address AS owner 
            FROM ${this.Contribution.tableName}
        ) AS A`
    )
  }

  async countActiveUsers() {
    return await this.count(
      `SELECT COUNT(DISTINCT(A.address)) 
        FROM (
          SELECT owner as address 
            FROM ${this.Publication.tableName} 
          UNION 
          SELECT args->>'from' AS address 
            FROM ${this.BlockchainEvent.tableName} 
            WHERE name IN ('Transfer', 'Update')
        ) AS A`
    )
  }

  async countTotalLandTraded() {
    return await this.count(
      `SELECT COUNT(owner) as count
        FROM ${this.Publication.tableName}
        WHERE status = $1`,
      [this.Publication.STATUS.sold]
    )
  }

  async countTotalLandOnSale() {
    return await this.count(
      `SELECT COUNT(owner) as count
        FROM ${this.Publication.tableName}
        WHERE status = $1
          AND tx_status = $2
          AND expires_at >= EXTRACT(epoch from now()) * 1000`,
      [this.Publication.STATUS.open, txUtils.TRANSACTION_STATUS.confirmed]
    )
  }

  async count(query, params = []) {
    const rows = await this.db.query(query, params)
    return rows.length ? parseInt(rows[0].count, 10) : 0
  }
}
