import { server } from 'decentraland-commons'

const DEFAULT_VALUES = Object.freeze({
  sort_by: 'created_at',
  sort_order: 'ASC',
  limit: 20,
  offset: 0
})

const ALLOWED_VALUES = Object.freeze({
  price: ['ASC'],
  created_at: ['DESC'],
  expires_at: ['ASC']
})

export class PublicationRequestFilters {
  static getDefaultValues() {
    return DEFAULT_VALUES
  }

  static getAllowedValues() {
    return DEFAULT_VALUES
  }

  constructor(req) {
    this.req = req
  }

  sanitize(req) {
    let by = server.extractFromReq(this.req, 'sort_by')
    let order = server.extractFromReq(this.req, 'sort_order')
    let limit = server.extractFromReq(this.req, 'limit')
    let offset = server.extractFromReq(this.req, 'offset')

    by = by in ALLOWED_VALUES ? by : DEFAULT_VALUES['sort_by']
    order = ALLOWED_VALUES[by].includes(order.toUpperCase())
      ? order
      : ALLOWED_VALUES[by][0]
    limit = Math.max(Math.min(100, limit), 0)
    offset = Math.max(offset, 0)

    return {
      sort: {
        by,
        order
      },
      pagination: {
        limit,
        offset
      }
    }
  }
}
