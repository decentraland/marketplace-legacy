import { server } from 'decentraland-commons'
import { Contribution } from './Contribution.model'
import { sanitizeContributions } from '../sanitize'

export class ContributionRouter {
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
      '/addresses/:address/contributions',
      server.handleRequest(this.getAddressContributions)
    )
  }

  async getAddressContributions(req) {
    const address = server.extractFromReq(req, 'address')
    const contributions = await Contribution.findGroupedByAddress(
      address.toLowerCase()
    )

    return sanitizeContributions(contributions)
  }
}
