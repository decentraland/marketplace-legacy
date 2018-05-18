import { server, utils } from 'decentraland-commons'
import { District, DistrictAttributes } from './District.model'
import { blacklist, Router } from '../lib'

export class DistrictRouter extends Router {
  mount() {
    /**
     * Returns all stored districts
     * @return {array<District>}
     */
    this.app.get('/api/districts', server.handleRequest(this.getDistricts))
  }

  async getDistricts(): Promise<DistrictAttributes[]> {
    const districts = await District.findEnabled()
    return utils.mapOmit(districts, blacklist.district)
  }
}
