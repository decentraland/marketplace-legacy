import { server, utils } from 'decentraland-commons'
import * as express from 'express'

import { Estate, EstateAttributes } from './Estate.model'
import { Publication } from '../Publication'
import { AssetRouter } from '../Asset'
import { blacklist, Router } from '../lib'

export class EstateRouter extends Router {
  mount() {
    /**
     * Returns the estates for the supplied params
     * @param  {string} status - specify a publication status to retreive: [cancelled|sold|pending].
     * @param  {string} sort_by - Publication prop
     * @param  {string} sort_order - asc or desc
     * @param  {number} limit
     * @param  {number} offset
     * @return {array<Estate>}
     */
    this.app.get('/api/estates', server.handleRequest(this.getEstates))

    /**
     * Returns the parcels an address owns
     * @param  {string} address  - Estate owner
     * @param  {string} [status] - specify a publication status to retreive: [cancelled|sold|pending].
     * @return {array<Estate>}
     */
    this.app.get(
      '/api/addresses/:address/estates',
      server.handleRequest(this.getAddressEstates)
    )
  }

  async getEstates(
    req: express.Request
  ): Promise<{ estates: EstateAttributes[]; total: number }> {
    // Force estate type
    req.params.type = Publication.TYPES.estate

    const result = await new AssetRouter(this.app).getAssets(req)

    const estates = result.assets
    const total = result.total

    return { estates, total }
  }

  async getAddressEstates(req: express.Request): Promise<EstateAttributes[]> {
    const address = server.extractFromReq(req, 'address').toLowerCase()

    let estates = []

    try {
      const status = server.extractFromReq(req, 'status')
      estates = await Estate.findByOwnerAndStatus(address, status)
    } catch (error) {
      estates = await Estate.findByOwner(address)
    }

    return utils.mapOmit(estates, blacklist.estate)
  }
}
