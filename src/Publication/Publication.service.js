import { txUtils } from 'decentraland-commons'

import { Publication } from './Publication'

export class PublicationService {
  constructor() {
    this.Publication = Publication
  }

  async filter(filters) {
    const { sort, pagination } = filters.sanitize()

    const conditions = {
      status: Publication.STATUS.open,
      tx_status: txUtils.TRANSACTION_STATUS.confirmed
    }
    const order = { [sort.by]: sort.order }
    const paginate = `LIMIT ${pagination.limit} OFFSET ${pagination.offset}`

    const [publications, total] = await Promise.all([
      this.Publication.find(conditions, order, paginate),
      this.Publication.count(conditions)
    ])

    return {
      publications,
      total
    }
  }
}
