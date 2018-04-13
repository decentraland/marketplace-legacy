import { Model } from 'decentraland-commons'

import { Publication } from '../Publication'
import { BlockchainEvent } from '../BlockchainEvent'

export class DashboardService {
  constructor() {
    this.db = Model.db
    this.Publication = Publication
    this.BlockchainEvent = BlockchainEvent
  }

  async fetchStats() {
    /*
    * Volume MANA transacted in the last 24h (size of market)
    * Total LAND sold (size of market)
    * Total LAND published (interest)
    * Average LAND price (market formation)
    * List of latest transactions (instant)
    */
    const [
      last24HourVolume,
      totalLandSold,
      totalLandPublished,
      averageLandPrice,
      medianLandPrice,
      transactionList
    ] = await Promise.all([
      this.findLast24HourVolume(),
      this.findTotalLandSold(),
      this.findTotalLandPublished(),
      this.findAverageLandPrice(),
      this.findMedianLandPrice(),
      this.findTransactionList()
    ])

    return {
      last24HourVolume,
      totalLandSold,
      totalLandPublished,
      averageLandPrice,
      medianLandPrice,
      transactionList
    }
  }

  async findLast24HourVolume() {
    const aDayAgo = Date.now() - 24 * 60 * 60 * 1000

    const rows = await this.db.query(
      `SELECT SUM(price) as volume
        FROM ${Publication.tableName}
        WHERE block_time_updated_at >= $1
          AND status = $2`,
      [aDayAgo, this.Publication.STATUS.sold]
    )
    return rows.length ? parseInt(rows[0].volume, 10) : 0
  }

  async findTotalLandSold() {
    const rows = await this.db.query(
      `SELECT COUNT(DISTINCT(x,y)) as count
        FROM ${Publication.tableName}
        WHERE status = $1`,
      [this.Publication.STATUS.sold]
    )

    return rows.length ? parseInt(rows[0].count, 10) : 0
  }

  findTotalLandPublished() {
    return this.Publication.count({
      status: this.Publication.STATUS.open
    })
  }

  async findAverageLandPrice() {
    const rows = await this.db.query(
      `SELECT AVG(price) as average
        FROM ${Publication.tableName}`
    )
    return rows.length ? parseInt(rows[0].average, 10) : 0
  }

  async findMedianLandPrice() {
    const rows = await this.db.query(
      `SELECT DISTINCT(price)
        FROM ${Publication.tableName}
        ORDER BY price ASC`
    )
    const prices = rows.map(row => row.price)
    const half = Math.floor(prices.length / 2)

    return prices.length % 2 === 0
      ? (prices[half - 1] + prices[half]) / 2
      : prices[half]
  }

  async findTransactionList() {
    return await this.BlockchainEvent.findLastest()
  }
}
