import { server, utils } from 'decentraland-commons'
import * as express from 'express'

import { Contribution, ContributionAttributes } from './Contribution.model'
import { blacklist, Router } from '../lib'

export class ContributionRouter extends Router {
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

  async getAddressContributions(
    req: express.Request
  ): Promise<ContributionAttributes[]> {
    const address = server.extractFromReq(req, 'address')
    const contributions = await Contribution.findGroupedByAddress(
      address.toLowerCase()
    )

    return utils.mapOmit(contributions, blacklist.contribution)
  }
}
