import { server, utils } from 'decentraland-commons'

import { Asset } from './Asset'
import { PublicationRequestFilters, PublicationService } from '../Publication'
import { blacklist } from '../lib'

export class AssetRouter {
  constructor(app) {
    this.app = app
  }

  mount() {
    /**
     * Returns the assets filtered by the supplied params
     * @param  {string} type - specify a publication type to retreive: [parcel|estate|...].
     * @param  {string} status - specify a publication status to retreive: [cancelled|sold|pending].
     * @param  {string} sort_by - Publication prop
     * @param  {string} sort_order - asc or desc
     * @param  {number} limit
     * @param  {number} offset
     * @return {array<Asset>}
     */
    this.app.get('/assets', server.handleRequest(this.getAssets))
  }

  async getAssets(req) {
    const filters = new PublicationRequestFilters(req)
    const Model = new PublicationService().getModelFromType(filters.getType())
    const result = await new Asset(Model).filter(filters)

    return {
      assets: this.blacklistFilteredAssets(result.assets),
      total: result.total
    }
  }

  blacklistFilteredAssets(assets) {
    return assets.map(({ publication, ...asset }) => ({
      ...utils.omit(asset, blacklist.asset),
      publication: utils.omit(publication, blacklist.publication)
    }))
  }
}
