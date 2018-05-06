import { txUtils } from 'decentraland-eth'
import { Model } from 'decentraland-commons'

import { Parcel } from '../Parcel'
import { Publication } from '../Publication'

export class DashboardService {
  constructor() {
    this.db = Model.db
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
      `SELECT COUNT(DISTINCT(owner)) as count
        FROM ${this.Parcel.tableName}
        WHERE owner IS NOT NULL`
    )
  }

  async countActiveUsers() {
    return await this.count(
      `SELECT COUNT(DISTINCT(owner)) as count
        FROM ${this.Publication.tableName}`
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
