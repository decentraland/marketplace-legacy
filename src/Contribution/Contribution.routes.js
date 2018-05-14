import { server, utils } from 'decentraland-commons'
import { Contribution } from './Contribution.model'
import { blacklist } from '../lib'

export class ContributionRoutes {
  constructor(app) {
    this.app = app
  }

  mount() {
    /**
     * Get the contributions for an address
     * @param  {string} address - District contributor
     * @return {array<Contribution>}
     */
    this.app.get(
      '/api/addresses/:address/contributions',
      server.handleRequest(this.getAddressContributions)
    )
  }

  async getAddressContributions(req) {
    const address = server.extractFromReq(req, 'address')
    const contributions = await Contribution.findGroupedByAddress(
      address.toLowerCase()
    )

    return utils.mapOmit(contributions, blacklist.contribution)
  }
}
