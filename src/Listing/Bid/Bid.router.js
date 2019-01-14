import { server } from 'decentraland-commons'

import { Bid } from './Bid.model'
import { Parcel } from '../../Asset'
import { ASSET_TYPES } from '../../../shared/asset'
import { sanitizeBids } from '../../sanitize'

export class BidRouter {
  constructor(app) {
    this.app = app
  }

  mount() {
    /**
     * Returns the bids for an asset
     * @param  {string} x
     * @param  {string} y
     * @param  {string} asset_type - specify an asset type, it's required
     * @param  {string} [status] - specify a status to retreive: [cancelled|sold|pending].
     * @return {array<Bid>}
     */
    this.app.get('/assets/:id/bids', server.handleRequest(this.getAssetBids))

    /**
     * Returns the bids for a parcel
     * @param  {string} x
     * @param  {string} y
     * @param  {string} [status] - specify a status to retreive: [cancelled|sold|pending].
     * @return {array<Bid>}
     */
    this.app.get(
      '/parcels/:x/:y/bids',
      server.handleRequest(this.getParcelBids.bind(this))
    )

    /**
     * Returns the bids for a estate
     * @param  {string} id
     * @param  {string} [status] - specify a status to retreive: [cancelled|sold|pending].
     * @return {array<Bid>}
     */
    this.app.get(
      '/estates/:id/bids',
      server.handleRequest(this.getEstateBids.bind(this))
    )

    /**
     * Get a bid by id
     * @param  {string} id
     * @return {array}
     */
    this.app.get('/bids/:id', server.handleRequest(this.getBid))
  }

  async getParcelBids(req) {
    const x = server.extractFromReq(req, 'x')
    const y = server.extractFromReq(req, 'y')

    req.params.asset_type = ASSET_TYPES.parcel
    req.params.id = Parcel.buildId(x, y)

    return this.getAssetBids(req)
  }

  async getEstateBids(req) {
    req.params.asset_type = ASSET_TYPES.estate

    return this.getAssetBids(req)
  }

  async getAssetBids(req) {
    const id = server.extractFromReq(req, 'id')

    const assetType = server.extractFromReq(req, 'asset_type')

    let bids = []

    try {
      const status = server.extractFromReq(req, 'status')
      bids = await Bid.findByAssetIdWithStatus(id, assetType, status)
    } catch (error) {
      bids = await Bid.findByAssetId(id, assetType)
    }

    return sanitizeBids(bids)
  }

  async getBid(req) {
    const id = server.extractFromReq(req, 'id')
    const bid = await Bid.findOne({ id })

    if (!bid) {
      throw new Error(`Could not find a valid bid with the id: "${id}"`)
    }

    return sanitizeBids(bid)
  }
}
