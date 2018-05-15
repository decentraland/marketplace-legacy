import { server, utils } from 'decentraland-commons'

import { State } from './State.model'
import { Publication } from '../Publication'
import { AssetRouter } from '../Asset'
import { blacklist } from '../lib'

export class StateRoutes {
  constructor(app) {
    this.app = app
  }

  mount() {
    /**
     * Returns the states for the supplied params
     * @param  {string} status - specify a publication status to retreive: [cancelled|sold|pending].
     * @param  {string} sort_by - Publication prop
     * @param  {string} sort_order - asc or desc
     * @param  {number} limit
     * @param  {number} offset
     * @return {array<State>}
     */
    this.app.get('/api/states', server.handleRequest(this.getStates))

    /**
     * Returns the parcels an address owns
     * @param  {string} address  - State owner
     * @param  {string} [status] - specify a publication status to retreive: [cancelled|sold|pending].
     * @return {array<State>}
     */
    this.app.get(
      '/api/addresses/:address/states',
      server.handleRequest(this.getAddressStates)
    )
  }

  async getStates(req) {
    // Force state type
    req.params.type = Publication.TYPES.state

    const result = new AssetRouter().getAssets(req)

    const states = result.assets
    const total = result.total

    return { states, total }
  }

  async getAddressStates(req) {
    const address = server.extractFromReq(req, 'address').toLowerCase()

    let states = []

    try {
      const status = server.extractFromReq(req, 'status')
      states = await State.findByOwnerAndStatus(address, status)
    } catch (error) {
      states = await State.findByOwner(address)
    }

    return utils.mapOmit(states, blacklist.state)
  }
}
