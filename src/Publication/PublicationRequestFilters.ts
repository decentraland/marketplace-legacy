import { server } from 'decentraland-commons'
import * as express from 'express'

import { Publication } from './Publication.model'

export interface Filter {
  status: string
  type: string
  sort: { by: string; order: string }
  pagination: { limit: number; offset: number }
}

const ALLOWED_VALUES = Object.freeze({
  price: ['ASC'],
  created_at: ['DESC'],
  block_time_updated_at: ['DESC'],
  expires_at: ['ASC']
})

export class PublicationRequestFilters {
  req: express.Request

  constructor(req: express.Request) {
    this.req = req
  }

  static getAllowedValues() {
    return ALLOWED_VALUES
  }

  sanitize(): Filter {
    return {
      status: this.getStatus(),
      type: this.getType(),
      sort: this.getSort(),
      pagination: this.getPagination()
    }
  }

  getStatus(): Filter['status'] {
    const status = this.getReqParam('status')
    return Publication.isValidStatus(status) ? status : Publication.STATUS.open
  }

  getType(): Filter['type'] {
    const type = this.getReqParam('type')
    return Publication.isValidType(type) ? type : Publication.TYPES.parcel
  }

  getSort(): Filter['sort'] {
    let by = this.getReqParam('sort_by')
    const order = this.getReqParam('sort_order')

    by = by in ALLOWED_VALUES ? by : 'created_at'

    return {
      by,
      order: ALLOWED_VALUES[by].includes(order.toUpperCase())
        ? order
        : ALLOWED_VALUES[by][0]
    }
  }

  getPagination(): Filter['pagination'] {
    const limit = parseInt(this.getReqParam('limit'), 10)
    const offset = parseInt(this.getReqParam('offset'), 10)

    return {
      limit: Math.max(Math.min(100, limit), 0),
      offset: Math.max(offset, 0)
    }
  }

  getReqParam(name) {
    return server.extractFromReq(this.req, name)
  }
}
