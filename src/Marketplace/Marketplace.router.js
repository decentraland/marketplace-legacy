import { server } from 'decentraland-commons'

import { Marketplace } from './Marketplace'
import { PublicationService } from '../Publication'
import { ReqQueryParams, MarketplaceReqQueryParams } from '../ReqQueryParams'
import { sanitizeAssets } from '../sanitize'

export class MarketplaceRouter {
  constructor(app) {
    this.app = app
  }

  mount() {
    /**
     * Returns the assets for the supplied params
     * @param  {string} asset_type - specify an asset type, will return everything if left blank [parcel|estate]
     * @param  {string} status - specify a publication status to retreive: [cancelled|sold|pending].
     * @param  {string} sort_by - Publication prop
     * @param  {string} sort_order - asc or desc
     * @param  {number} limit
     * @param  {number} offset
     * @return {array<Asset>}
     */
    this.app.get('/marketplace', server.handleRequest(this.getAssets))
  }

  async getAssets(req) {
    // `status` is required but we use the default provided by MarketplaceReqQueryParams
    const reqQueryParams = new ReqQueryParams(req)
    const marketplaceReqQueryParams = new MarketplaceReqQueryParams(req)

    let result

    if (reqQueryParams.has('asset_type')) {
      const PublicableAsset = new PublicationService().getPublicableAssetFromType(
        reqQueryParams.get('asset_type')
      )

      result = await new Marketplace().filter(
        marketplaceReqQueryParams,
        PublicableAsset
      )
    } else {
      result = await new Marketplace().filterAll(marketplaceReqQueryParams)
    }

    return {
      assets: sanitizeAssets(result.assets),
      total: result.total
    }
  }
}
