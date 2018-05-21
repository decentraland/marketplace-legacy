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
      '/api/parcels/:address/mortgages',
      server.handleRequest(this.getMortgagedParcelsByBorrower)
    )

    /**
     * Get mortgages by borrower
     * @param  {string} address
     * @return {array<Mortgage>}
     */
    this.app.get(
      '/api/addresses/:address/mortgages',
      server.handleRequest(this.getMortgagesByBorrower)
    )

    /**
     * Get mortgages by coordinates
     * @param  {string} x
     * @param  {string} y
     * @return {array<Mortgage>}
     */
    this.app.get(
      '/api/parcels/:x/:y/mortgages',
      server.handleRequest(this.getActiveMortgagesInCoordinate)
    )
  }

  async getMortgagedParcelsByBorrower(req) {
    const borrower = server.extractFromReq(req, 'address')
    const parcels = await Parcel.findWithLastActiveMortgageByBorrower(borrower)
    return utils.mapOmit(parcels, blacklist.parcel)
  }

  async getMortgagesByBorrower(req) {
    const borrower = server.extractFromReq(req, 'address')
    return await Mortgage.findActivesByBorrower(borrower)
  }

  async getActiveMortgagesInCoordinate(req) {
    const x = server.extractFromReq(req, 'x')
    const y = server.extractFromReq(req, 'y')
    const status = server.extractFromReq(req, 'status')

    let mortgages = []
    if (status === 'active') {
      mortgages = await Mortgage.findActivesInCoordinate(Parcel.buildId(x, y))
    }
    return mortgages
  }
}
