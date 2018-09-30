import { server, utils } from 'decentraland-commons'

import { Marketplace } from './Marketplace'
import { MarketplaceReqQueryParams } from '../ReqQueryParams'
import { AssetRouter } from '../Asset'

export class MarketplaceRouter {
  constructor(app) {
    this.app = app
  }

  mount() {
    /**
     * Returns the estates for the supplied params
     * @param  {string} asset_type - specify an asset type, will return everything if left blank [parcel|estate]
     * @param  {string} status - specify a publication status to retreive: [cancelled|sold|pending].
     * @param  {string} sort_by - Publication prop
     * @param  {string} sort_order - asc or desc
     * @param  {number} limit
     * @param  {number} offset
     * @return {array<Estate>}
     */
    this.app.get('/marketplace', server.handleRequest(this.getMarketplace))
  }

  async getMarketplace(req) {
    const queryParams = new MarketplaceReqQueryParams(req)
    const result = queryParams.has('asset_type')
      ? await new AssetRouter().getAssets(req)
      : await new Marketplace().filterAll(queryParams)

    return {
      assets: result.assets,
      total: result.total
    }
  }
}
