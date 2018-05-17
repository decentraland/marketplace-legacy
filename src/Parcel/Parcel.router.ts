import { server, utils } from 'decentraland-commons'
import * as express from 'express'

import { Parcel, ParcelAttributes } from './Parcel.model'
import { Publication } from '../Publication'
import { AssetRouter } from '../Asset'
import { blacklist, Router } from '../lib'

export class ParcelRouter extends Router {
  mount() {
    /**
     * Returns the parcels in between the supplied coordinates
     * Or filtered by the supplied params
     * @param  {string} nw - North west coordinate
     * @param  {string} sw - South west coordinate
     * @param  {string} status - specify a publication status to retreive: [cancelled|sold|pending].
     * @param  {string} sort_by - Publication prop
     * @param  {string} sort_order - asc or desc
     * @param  {number} limit
     * @param  {number} offset
     * @return {array<Parcel>}
     */
    this.app.get('/api/parcels', server.handleRequest(this.getParcels))

    /**
     * Returns the parcels an address owns
     * @param  {string} address  - Parcel owner
     * @param  {string} [status] - specify a publication status to retreive: [cancelled|sold|pending].
     * @return {array<Parcel>}
     */
    this.app.get(
      '/api/addresses/:address/parcels',
      server.handleRequest(this.getAddressParcels)
    )
  }

  async getParcels(
    req: express.Request
  ): Promise<{ parcels: ParcelAttributes[]; total: number }> {
    let parcels
    let total

    try {
      const nw = server.extractFromReq(req, 'nw')
      const se = server.extractFromReq(req, 'se')
      const rangeParcels = await Parcel.inRange(nw, se)

      parcels = utils.mapOmit(rangeParcels, blacklist.parcel)
      total = parcels.length
    } catch (error) {
      // Force parcel type
      req.params.type = Publication.TYPES.parcel

      const result = await new AssetRouter(this.app).getAssets(req)

      parcels = result.assets
      total = result.total
    }

    return { parcels, total }
  }

  async getAddressParcels(req: express.Request): Promise<ParcelAttributes[]> {
    const address = server.extractFromReq(req, 'address').toLowerCase()

    let parcels = []

    try {
      const status = server.extractFromReq(req, 'status')
      parcels = await Parcel.findByOwnerAndStatus(address, status)
    } catch (error) {
      parcels = await Parcel.findByOwner(address)
    }

    return utils.mapOmit(parcels, blacklist.parcel)
  }
}
