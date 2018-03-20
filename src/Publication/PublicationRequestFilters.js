import { server } from 'decentraland-commons'

const DEFAULT_VALUES = Object.freeze({
  sort_by: 'created_at',
  sort_order: 'ASC',
  limit: 20,
  offset: 0
})

const ALLOWED_VALUES = Object.freeze({
  sort_by: ['price', 'expires_at', 'created_at'],
  sort_order: ['ASC', 'DESC']
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
    return {
      sort: {
        by: this.get('sort_by'),
        order: this.get('sort_order')
      },
      pagination: {
        limit: this.get('limit'),
        offset: this.get('offset')
      }
    }
  }

  get(propName) {
    let value = DEFAULT_VALUES[propName]

    try {
      const reqValue = server.extractFromReq(this.req, propName)
      if (this.isAllowed(propName, reqValue)) {
        value = reqValue
      }
    } catch (error) {
      // Keep default
    }

    return value
  }

  isAllowed(propName, value) {
    let isAllowed = false

    switch (propName) {
      case 'sort_by':
        isAllowed = ALLOWED_VALUES.sort_by.includes(value)
        break
      case 'sort_order':
        isAllowed = ALLOWED_VALUES.sort_order.includes(value.toUpperCase())
        break
      case 'limit':
        isAllowed = value > 0 && value < 100
        break
      case 'offset':
        isAllowed = value > 0
        break
      default:
        isAllowed = false
    }

    return isAllowed
  }
}
