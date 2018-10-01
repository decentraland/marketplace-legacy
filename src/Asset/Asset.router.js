import { server } from 'decentraland-commons'

import { Asset } from './Asset'
import { MarketplaceRouter } from '../Marketplace'
import { PublicationService } from '../Publication'
import { ReqQueryParams, AssetReqQueryParams } from '../ReqQueryParams'
import { sanitizeAssets } from '../sanitize'

export class AssetRouter {
  constructor(app) {
    this.app = app
  }

  mount() {
    /**
     * Returns the assets filtered by the supplied params
     * @param  {string} asset_type - specify a publication type to retreive: [parcel|estate|...].
     * @param  {string} status - specify a publication status to retreive: [cancelled|sold|pending].
     * @param  {string} sort_by - Publication prop
     * @param  {string} sort_order - asc or desc
     * @param  {number} limit
     * @param  {number} offset
     * @return {array<Asset>}
     */
    this.app.get('/assets', server.handleRequest(this.getAssets.bind(this)))
  }

  async getAssets(req) {
    const reqQueryParams = new ReqQueryParams(req)
    if (!reqQueryParams.has('asset_type')) {
      throw new Error('The asset_type query param is required to get an asset')
    }

    const PublicableAsset = new PublicationService().getPublicableAssetFromType(
      reqQueryParams.get('asset_type')
    )
    let result

    if (reqQueryParams.has('status')) {
      result = await new MarketplaceRouter().getAssets(req)
    } else {
      result = await new Asset(PublicableAsset).filter(
        new AssetReqQueryParams(req)
      )
    }

    return {
      assets: sanitizeAssets(result.assets),
      total: result.total
    }
  }
}
