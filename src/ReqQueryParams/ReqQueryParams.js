import { server } from 'decentraland-commons'

export class ReqQueryParams {
  constructor(req) {
    this.req = req
  }

  sanitize() {
    throw new Error('Not implemented')
  }

  has(name) {
    try {
      server.extractFromReq(this.req, name)
      return true
    } catch (error) {
      return false
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
