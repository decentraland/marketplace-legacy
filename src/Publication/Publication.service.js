import { txUtils } from 'decentraland-eth'

import { Publication } from './Publication.model'
import { PublicationQueryBuilder } from './Publication.querybuilder'
import { QueryBuilder } from '../database'
import { Parcel } from '../Parcel'

export class PublicationService {
  constructor() {
    this.Publication = Publication
  }

  async filter(filters) {
    const { status, sort, pagination } = filters.sanitize()
    const tx_status = txUtils.TRANSACTION_STATUS.confirmed

    const where = new PublicationQueryBuilder()
      .assign({ status, tx_status })
      .isActive()
      .build()

    const [publications, count] = await Promise.all([
      this.Publication.findAll({
        attributes: {
          include: [QueryBuilder.buildRowToJsonAttribute(Parcel)]
        },
        where,
        include: {
          attributes: [],
          model: Parcel
        },
        order: [[sort.by, sort.order]],
        limit: pagination.limit,
        offset: pagination.offset,
        raw: true
      }),
      this.Publication.count({ where })
    ])

    const total = parseInt(count, 10)

    return {
      publications,
      total
    }
  }
}
