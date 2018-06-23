import { server, utils } from 'decentraland-commons'

import { Parcel } from './Parcel.model'
import { ASSET_TYPE } from '../shared/asset'
import { AssetRouter } from '../Asset'
import { blacklist } from '../lib'

export class ParcelRouter {
  constructor(app) {
    this.app = app
  }

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
    this.app.get('/parcels', server.handleRequest(this.getParcels))

    /**
     * Returns the parcels an address owns
     * @param  {string} address  - Parcel owner
     * @param  {string} [status] - specify a publication status to retreive: [cancelled|sold|pending].
     * @return {array<Parcel>}
     */
    this.app.get(
      '/addresses/:address/parcels',
      server.handleRequest(this.getAddressParcels)
    )
  }

  async getParcels(req) {
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
      req.params.type = ASSET_TYPE.parcel
      const result = await new AssetRouter().getAssets(req)

      parcels = result.assets
      total = result.total
    }

    return { parcels, total }
  }

  async getAddressParcels(req) {
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
