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
      // ,latestSaleTransactions
    ] = await Promise.all([
      this.countLandOwners(),
      this.countActiveUsers(),
      this.countTotalLandTraded(),
      this.countTotalLandOnSale()
      // this.findLatestSaleTransactions()
    ])

    return {
      landOwnersCount,
      activeUsersCount,
      totalLandTraded,
      totalLandOnSale
      // ,latestSaleTransactions
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
      `SELECT COUNT(DISTINCT(owner)) as count
        FROM ${this.Publication.tableName}
        WHERE status = $1`,
      [this.Publication.STATUS.sold]
    )
  }

  async countTotalLandOnSale() {
    return await this.count(
      `SELECT COUNT(DISTINCT(owner)) as count
        FROM ${this.Publication.tableName}
        WHERE status = $1`,
      [this.Publication.STATUS.open]
    )
  }

  async findLatestSaleTransactions() {
    return await this.Publication.find(
      { status: this.Publication.STATUS.sold },
      { created_at: 'DESC' },
      'LIMIT 10'
    )
  }

  async count(query, params = []) {
    const rows = await this.db.query(query, params)
    return rows.length ? parseInt(rows[0].count, 10) : 0
  }
}
