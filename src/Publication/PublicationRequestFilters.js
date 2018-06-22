import { server } from 'decentraland-commons'

import { Publication } from './Publication.model'
import { PUBLICATION_TYPES, PUBLICATION_STATUS } from '../shared/publication'

export const ALLOWED_SORT_VALUES = Object.freeze({
  price: ['ASC'],
  created_at: ['DESC'],
  block_time_updated_at: ['DESC'],
  expires_at: ['ASC']
})
export const DEFAULT_STATUS = PUBLICATION_STATUS.open
export const DEFAULT_TYPE = PUBLICATION_TYPES.parcel
export const DEFAULT_SORT_VALUE = 'created_at'
export const DEFAULT_SORT = {
  by: DEFAULT_SORT_VALUE,
  order: ALLOWED_SORT_VALUES[DEFAULT_SORT_VALUE][0]
}
export const DEFAULT_PAGINATION = {
  offset: 0,
  limit: 20
}

export class PublicationRequestFilters {
  static getAllowedValues() {
    return ALLOWED_SORT_VALUES
  }

  constructor(req) {
    this.req = req
  }

  sanitize(req) {
    return {
      status: this.getOrDefault(this.getStatus, null),
      type: this.getOrDefault(this.getType, DEFAULT_TYPE),
      sort: this.getOrDefault(this.getSort, DEFAULT_SORT),
      pagination: this.getOrDefault(this.getPagination, DEFAULT_PAGINATION)
    }
  }

  getOrDefault(getter, defaultValue) {
    try {
      return getter.call(this)
    } catch (error) {
      return defaultValue
    }
  }

  getStatus() {
    const status = this.getReqParam('status')
    return Publication.isValidStatus(status) ? status : PUBLICATION_STATUS.open
  }

  getType() {
    const type = this.getReqParam('type')
    return Publication.isValidType(type) ? type : PUBLICATION_TYPES.parcel
  }

  getSort() {
    let by = this.getReqParam('sort_by')
    let order = this.getReqParam('sort_order')

    by = by in ALLOWED_SORT_VALUES ? by : DEFAULT_SORT.by

    return {
      by,
      order: ALLOWED_SORT_VALUES[by].includes(order.toUpperCase())
        ? order
        : ALLOWED_SORT_VALUES[by][0]
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
