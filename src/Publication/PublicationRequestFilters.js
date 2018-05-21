import { server } from 'decentraland-commons'

import { Publication } from './Publication.model'

const ALLOWED_VALUES = Object.freeze({
  price: ['ASC'],
  created_at: ['DESC'],
  block_time_updated_at: ['DESC'],
  expires_at: ['ASC']
})

export class PublicationRequestFilters {
  static getAllowedValues() {
    return ALLOWED_VALUES
  }

  constructor(req) {
    this.req = req
  }

  sanitize(req) {
    return {
      status: this.getStatus(),
      type: this.getType(),
      sort: this.getSort(),
      pagination: this.getPagination()
    }
  }

  getStatus() {
    const status = this.getReqParam('status')
    return Publication.isValidStatus(status) ? status : Publication.STATUS.open
  }

  getType() {
    const type = this.getReqParam('type')
    return Publication.isValidType(type) ? type : Publication.TYPES.parcel
  }

  getSort() {
    let by = this.getReqParam('sort_by')
    let order = this.getReqParam('sort_order')

    by = by in ALLOWED_VALUES ? by : 'created_at'

    return {
      by,
      order: ALLOWED_VALUES[by].includes(order.toUpperCase())
        ? order
        : ALLOWED_VALUES[by][0]
    }
  }

  getPagination() {
    let limit = this.getReqParam('limit')
    let offset = this.getReqParam('offset')

    return {
      limit: Math.max(Math.min(100, limit), 0),
      offset: Math.max(offset, 0)
    }
  }

  getReqParam(name) {
    return server.extractFromReq(this.req, name)
  }
}
