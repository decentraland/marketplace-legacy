import { server } from 'decentraland-commons'

import { unsafeParseInt } from '../lib'

export class ReqQueryParams {
  constructor(req) {
    this.req = req
  }

  has(name) {
    try {
      server.extractFromReq(this.req, name)
      return true
    } catch (error) {
      return false
    }
  }

  get(name, defaultValue) {
    try {
      return server.extractFromReq(this.req, name)
    } catch (error) {
      if (defaultValue === undefined) throw error
      return defaultValue
    }
  }

  getInteger(name, defaultValue) {
    let param, value
    try {
      param = this.get(name)
    } catch (error) {
      return defaultValue
    }

    try {
      value = unsafeParseInt(param)
    } catch (_) {
      throw new Error(
        `Invalid param "${name}" should be a integer but got "${param}"`
      )
    }
    return value
  }

  getBoolean(name, defaultValue) {
    let param
    try {
      param = this.get(name)
    } catch (error) {
      return defaultValue
    }

    const value = param === 'true' ? true : param === 'false' ? false : null
    if (value === null) {
      throw new Error(
        `Invalid param "${name}" should be a boolean but got "${param}"`
      )
    }
    return value
  }
}
