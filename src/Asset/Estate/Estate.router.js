import { server } from 'decentraland-commons'

import { Estate } from './Estate.model'
import { AssetRouter } from '../Asset.router'
import { sanitizeEstates, sanitizeEstate } from '../../sanitize'
import { ASSET_TYPES } from '../../shared/asset'

export class EstateRouter {
  constructor(app) {
    this.app = app
  }

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
    this.app.get('/estates', server.handleRequest(this.getEstates))

    /**
     * Returns the parcels an address owns
     * @param  {string} address  - Estate owner
     * @param  {string} [status] - specify a publication status to retreive: [cancelled|sold|pending].
     * @return {array<Estate>}
     */
    this.app.get(
      '/addresses/:address/estates',
      server.handleRequest(this.getAddressEstates)
    )

    /**
     * Returns the estates for the supplied params
     * @param  {string} id - estate's id (which corresponds with the blockchains token id)
     * @return {Estate}
     */
    this.app.get('/estates/:id', server.handleRequest(this.getEstate))
  }

  async getEstates(req) {
    // Force estate type
    req.params.asset_type = ASSET_TYPES.estate

    const result = await new AssetRouter().getAssets(req)

    const estates = result.assets // @nacho TODO: empty estates ??
    const total = result.total

    return { estates, total }
  }

  async getAddressEstates(req) {
    const address = server.extractFromReq(req, 'address').toLowerCase()

    let estates = []

    try {
      const status = server.extractFromReq(req, 'status')
      estates = await Estate.findByOwnerAndStatus(address, status)
    } catch (error) {
      estates = await Estate.findByOwner(address)
    }

    return sanitizeEstates(estates)
  }

  async getEstate(req) {
    const id = server.extractFromReq(req, 'id')
    const estate = await Estate.findByTokenId(id)
    if (!estate) {
      throw new Error(`Estate with id ${id} not found`)
    }
    return sanitizeEstate(estate)
  }
}
