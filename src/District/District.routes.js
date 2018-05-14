import { server, utils } from 'decentraland-commons'
import { District } from './District.model'
import { blacklist } from '../lib'

export class DistrictRoutes {
  constructor(app) {
    this.app = app
  }

  mount() {
    /**
     * Returns all stored districts
     * @return {array<District>}
     */
    this.app.get('/api/districts', server.handleRequest(this.getDistricts))
  }

  async getDistricts() {
    const districts = await District.findEnabled()
    return utils.mapOmit(districts, blacklist.district)
  }
}
