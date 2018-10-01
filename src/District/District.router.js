import { server, utils } from 'decentraland-commons'
import { District } from './District.model'
import { blacklistDistricts } from '../blacklist'

export class DistrictRouter {
  constructor(app) {
    this.app = app
  }

  mount() {
    /**
     * Returns all stored districts
     * @return {array<District>}
     */
    this.app.get('/districts', server.handleRequest(this.getDistricts))
  }

  async getDistricts() {
    const districts = await District.findEnabled()
    return blacklistDistricts(districts)
  }
}
