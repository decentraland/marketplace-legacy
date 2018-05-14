import { server, utils } from 'decentraland-commons'
import {
  Publication,
  PublicationRequestFilters,
  PublicationService
} from '../Publication'
import { blacklist } from '../lib'

export class StateRoutes {
  constructor(app) {
    this.app = app
  }

  mount() {
    /**
     * Returns the states for the supplied params
     * @param  {string} sort_by - Publication prop
     * @param  {string} sort_order - asc or desc
     * @param  {number} limit
     * @param  {number} offset
     * @return {array<Parcel>}
     */
    this.app.get('/api/states', server.handleRequest(this.getStates))
  }

  async getStates(req) {
    let states
    let total

    const filters = new PublicationRequestFilters(req)
    const filterResult = await new PublicationService().filter(
      filters,
      Publication.TYPES.state
    )
    const publicationBlacklist = [...blacklist.publication, 'parcel']

    // Invert keys, from { publication: { state } } to { state: { publication } }
    states = filterResult.publications.map(publication => ({
      ...utils.omit(publication.state, blacklist.state),
      publication: utils.omit(publication, publicationBlacklist)
    }))
    total = filterResult.total

    return { states, total }
  }
}
