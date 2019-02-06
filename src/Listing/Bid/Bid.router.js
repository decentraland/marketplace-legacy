import { server } from 'decentraland-commons'

import { Bid } from './Bid.model'
import { Parcel } from '../../Asset'
import { ASSET_TYPES } from '../../../shared/asset'
import { sanitizeAssets } from '../../sanitize'

export class BidRouter {
  constructor(app) {
    this.app = app
  }

  mount() {
    /**
     * Returns the bids for an asset
     * @param  {string} asset_id - id of the asset: [x,y|estateId]
     * @param  {string} asset_type - specify an asset type, it's required
     * @param  {string} [status] - specify a status to retreive: [cancelled|sold|pending].
     * @param  {string} [bidder] - bidder address
     * @return {array<Bid>}
     */
    this.app.get('/assets/:id/bids', server.handleRequest(this.getAssetBids))

    /**
     * Returns the bids for a parcel
     * @param  {string} x
     * @param  {string} y
     * @param  {string} [status] - specify a status to retreive: [cancelled|sold|pending].
     * @param  {string} [bidder] - bidder address
     * @return {array<Bid>}
     */
    this.app.get(
      '/parcels/:x/:y/bids',
      server.handleRequest(this.getParcelBids.bind(this))
    )

    /**
     * Returns the bids for an estate
     * @param  {string} id
     * @param  {string} [status] - specify a status to retreive: [cancelled|sold|pending].
     * @param  {string} [bidder] - bidder address
     * @return {array<Bid>}
     */
    this.app.get(
      '/estates/:id/bids',
      server.handleRequest(this.getEstateBids.bind(this))
    )

    this.app.get(
      '/bids/:address/assets',
      server.handleRequest(this.getBidAssets)
    )

    /**
     * Get a bid by id
     * @param  {string} id
     * @return {Bid}
     */
    this.app.get('/bids/:id', server.handleRequest(this.getBidById))

    /**
     * Returns the bids where an address is the seller or bidder
     * @param {string} [seller] - Asset owner
     * @param  {string} [status] - specify a bid status to retreive: [cancelled|sold|pending].
     * @return {array<Bid>}
     */
    this.app.get(
      '/addresses/:address/bids',
      server.handleRequest(this.getAddressBids)
    )
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

    try {
      const bidder = server.extractFromReq(req, 'bidder')
      bids = bids.filter(bid => bid.bidder === bidder)
    } catch (errror) {
      // Do nothing
    }

    return bids
  }

  async getBidById(req) {
    const id = server.extractFromReq(req, 'id')
    const bid = await Bid.findOne({ id })

    if (!bid) {
      throw new Error(`Could not find a valid bid with the id: "${id}"`)
    }

    return bid
  }

  async getAddressBids(req) {
    const address = server.extractFromReq(req, 'address')
    let bids = []

    try {
      const status = server.extractFromReq(req, 'status')
      bids = await Bid.findByAddressAndStatus(address, status)
    } catch (error) {
      bids = await Bid.findByAddress(address)
    }

    return bids
  }

  async getBidAssets(req) {
    const address = server.extractFromReq(req, 'address')
    let assets

    try {
      const status = server.extractFromReq(req, 'status')
      assets = await Bid.findBidAssetsByStatuses(address, [status])
    } catch (error) {
      assets = await Bid.findBidAssetsByStatuses(address)
    }

    return sanitizeAssets(assets)
  }
}
