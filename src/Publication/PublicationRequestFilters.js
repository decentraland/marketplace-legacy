import { server } from 'decentraland-commons'

import { Publication } from './Publication.model'
import {
  PUBLICATION_ASSET_TYPES,
  PUBLICATION_STATUS
} from '../shared/publication'

export const ALLOWED_SORT_VALUES = Object.freeze({
  price: ['ASC'],
  created_at: ['DESC'],
  block_time_updated_at: ['DESC'],
  expires_at: ['ASC']
})
export const DEFAULT_STATUS = PUBLICATION_STATUS.open
export const DEFAULT_ASSET_TYPE = PUBLICATION_ASSET_TYPES.parcel
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
      status: this.getStatus(),
      asset_type: this.getAssetType(),
      sort: this.getSort(),
      pagination: this.getPagination()
    }
  }

  getStatus() {
    const status = this.getReqParam('status', PUBLICATION_STATUS.open)
    return Publication.isValidStatus(status) ? status : PUBLICATION_STATUS.open
  }

  getAssetType() {
    const type = this.getReqParam('asset_type', PUBLICATION_ASSET_TYPES.parcel)
    return Publication.isValidAssetType(type)
      ? type
      : PUBLICATION_ASSET_TYPES.parcel
  }

  getSort() {
    let by = this.getReqParam('sort_by', DEFAULT_SORT.by)
    let order = this.getReqParam('sort_order', '')

    by = by in ALLOWED_SORT_VALUES ? by : DEFAULT_SORT.by

    return {
      by,
      order: ALLOWED_SORT_VALUES[by].includes(order.toUpperCase())
        ? order
        : ALLOWED_SORT_VALUES[by][0]
    }
  }

  getPagination() {
    const limit = this.getReqParam('limit', DEFAULT_PAGINATION.limit)
    const offset = this.getReqParam('offset', DEFAULT_PAGINATION.offset)

    return {
      limit: Math.max(Math.min(100, limit), 0),
      offset: Math.max(offset, 0)
    }
  }

  getReqParam(name, defaultValue) {
    try {
      return server.extractFromReq(this.req, name)
    } catch (error) {
      if (defaultValue === undefined) throw error
      return defaultValue
    }
  }
}
