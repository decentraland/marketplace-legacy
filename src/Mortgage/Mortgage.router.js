import { server, utils } from 'decentraland-commons'

import { Mortgage } from './Mortgage.model'
import { Parcel } from '../Parcel'
import { blacklist } from '../lib'

export class MortgageRouter {
  constructor(app) {
    this.app = app
  }

  mount() {
    /**
     * Get parcels with mortgages by borrower
     * @param  {string} address
     * @return {array<Parcel>}
     */
    this.app.get(
      '/parcels/:address/mortgages',
      server.handleRequest(this.getMortgagedParcelsByBorrower)
    )

    /**
     * Get mortgages by borrower
     * @param  {string} address
     * @param  {string} status - specify mortgage statuses to retreive
     * @return {array<Mortgage>}
     */
    this.app.get(
      '/addresses/:address/mortgages',
      server.handleRequest(this.getMortgagesByBorrower.bind(this))
    )

    /**
     * Get mortgages by coordinates
     * @param  {string} x
     * @param  {string} y
     * @param  {string} status - specify mortgage statuses to retreive
     * @return {array<Mortgage>}
     */
    this.app.get(
      '/parcels/:x/:y/mortgages',
      server.handleRequest(this.getMortgagesInCoordinate.bind(this))
    )
  }

  async getMortgagedParcelsByBorrower(req) {
    const borrower = server.extractFromReq(req, 'address')
    const parcels = await Parcel.findWithLastActiveMortgageByBorrower(borrower)
    return utils.mapOmit(parcels, blacklist.parcel)
  }

  async getMortgagesByBorrower(req) {
    const borrower = server.extractFromReq(req, 'address')
    const status = this.getSafeStatusFromRequest()

    return Mortgage.findByBorrower(borrower, status)
  }

  async getMortgagesInCoordinate(req) {
    const x = server.extractFromReq(req, 'x')
    const y = server.extractFromReq(req, 'y')
    const status = this.getSafeStatusFromRequest()

    return Mortgage.findInCoordinate(Parcel.buildId(x, y), status)
  }

  getSafeStatusFromRequest(req) {
    try {
      return server.extractFromReq(req, 'status')
    } catch (error) {
      // undefined
    }
  }
}
