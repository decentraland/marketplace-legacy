import { txUtils } from 'decentraland-eth'

import { db, queryDatabase, Op } from '../database'
import { Parcel } from '../Parcel'
import { Publication, PublicationQueryBuilder } from '../Publication'

export class DashboardService {
  constructor() {
    this.db = db
    this.Parcel = Parcel
    this.Publication = Publication
  }

  async getStats() {
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

  countLandOwners() {
    return this.Parcel.count({
      distinct: true,
      col: 'owner',
      where: { owner: { [Op.ne]: null } }
    })
  }

  countActiveUsers() {
    return this.Publication.count({
      distinct: true,
      col: 'owner'
    })
  }

  countTotalLandTraded() {
    return this.Publication.count({
      col: 'owner',
      where: { status: this.Publication.STATUS.sold }
    })
  }

  countTotalLandOnSale() {
    const where = new PublicationQueryBuilder()
      .assign({
        status: this.Publication.STATUS.open,
        tx_status: txUtils.TRANSACTION_STATUS.confirmed
      })
      .isActive()
      .build()

    return this.Publication.count({ col: 'owner', where })
  }

  async count(query, options) {
    const [result] = await queryDatabase(query, options)
    const count = result[0].count
    return parseInt(count, 10)
  }
}
