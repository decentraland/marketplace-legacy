import { server } from 'decentraland-commons'

import { Bid } from './Bid.model'
import { Parcel } from '../../Asset'
import { ASSET_TYPES } from '../../../shared/asset'
// import { sanitizePublications } from '../sanitize'

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
     * @return {array<Publication>}
     */
    this.app.get('/assets/:id/bids', server.handleRequest(this.getAssetBids))

    // /**
    //  * Returns the publications for a parcel
    //  * @param  {string} x
    //  * @param  {string} y
    //  * @param  {string} [status] - specify a status to retreive: [cancelled|sold|pending].
    //  * @return {array<Publication>}
    //  */
    // this.app.get(
    //   '/parcels/:x/:y/bids',
    //   server.handleRequest(this.getParcelPublications.bind(this))
    // )

    // /**
    //  * Returns the publications for a estate
    //  * @param  {string} id
    //  * @param  {string} [status] - specify a status to retreive: [cancelled|sold|pending].
    //  * @return {array<Publication>}
    //  */
    // this.app.get(
    //   '/estates/:id/bids',
    //   server.handleRequest(this.getEstatePublications.bind(this))
    // )

    // /**
    //  * Get a publication by transaction hash
    //  * @param  {string} id
    //  * @return {array}
    //  */
    // this.app.get('/bids/:id', server.handleRequest(this.getPublication))
  }

  // async getParcelPublications(req) {
  //   const x = server.extractFromReq(req, 'x')
  //   const y = server.extractFromReq(req, 'y')

  //   req.params.asset_type = ASSET_TYPES.parcel
  //   req.params.id = Parcel.buildId(x, y)

  //   return this.getAssetPublications(req)
  // }

  // async getEstatePublications(req) {
  //   req.params.asset_type = ASSET_TYPES.estate

  //   return this.getAssetPublications(req)
  // }

  async getAssetBids(req) {
    const id = server.extractFromReq(req, 'id')

    server.extractFromReq(req, 'asset_type') // TODO: Use asset_type on `Publication.findByAsset(...)`. For now just throw if undefined

    let bids = []

    try {
      const status = server.extractFromReq(req, 'status')
      bids = await Bid.findByAssetIdWithStatus(id, status)
    } catch (error) {
      bids = await Bid.findByAssetId(id)
    }

    // @TODO: sanitize result
    return bids // sanitizePublications(publications)
  }

  // async getPublication(req) {
  //   const txHash = server.extractFromReq(req, 'txHash')
  //   const publication = await Publication.findOne({ tx_hash: txHash })

  //   if (!publication) {
  //     throw new Error(
  //       `Could not find a valid publication for the hash "${txHash}"`
  //     )
  //   }

  //   return publication
  // }
}
