import { server } from 'decentraland-commons'

import { Publication } from '../Publication'
import { AssetRouter } from '../Asset'

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
     * @return {array<Parcel>}
     */
    this.app.get('/api/states', server.handleRequest(this.getStates))
  }

  async getStates(req) {
    // Force state type
    req.params.type = Publication.TYPES.state

    const result = new AssetRouter().filterAssets(req)

    const states = result.assets
    const total = result.total

    return { states, total }
  }
}
