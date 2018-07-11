import { server, utils } from 'decentraland-commons'

import { Parcel } from './Parcel.model'
import { ASSET_TYPE } from '../shared/asset'
import { Bounds } from '../shared/map'
import { AssetRouter } from '../Asset'
import { blacklist } from '../lib'
import { unsafeParseInt } from '../lib/unsafeParseInt'

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
     * Returns the parcels in between the supplied coordinates
     * Or filtered by the supplied params
     * @param  {string} x - coordinate X
     * @param  {string} y - coordinate Y
     * @return {array<Parcel>}
     */
    this.app.get('/parcels/:x/:y', server.handleRequest(this.getParcel))

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

  async getParcel(req) {
    let parcel, x, y

    try {
      x = unsafeParseInt(server.extractFromReq(req, 'x'))
    } catch (e) {
      throw new Error('Invalid coordinate "x" must be an integer')
    }

    try {
      y = unsafeParseInt(server.extractFromReq(req, 'y'))
    } catch (e) {
      throw new Error('Invalid coordinate "y" must be an integer')
    }

    if (!Bounds.inBounds(x, y)) {
      throw new Error(
        `Coords are out of bounds: ${JSON.stringify(Bounds.getBounds())}`
      )
    }
    const coords = Parcel.buildId(x, y)
    const range = await Parcel.inRange(coords, coords)

    parcel = utils.omit(range[0], blacklist.parcel)

    return parcel
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
