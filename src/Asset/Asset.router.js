import { server, utils } from 'decentraland-commons'

import { Asset } from './Asset'
import { Marketplace } from '../Marketplace'
import { PublicationService } from '../Publication'
import {
  ReqQueryParams,
  MarketplaceQueryParams,
  AssetReqQueryParams
} from '../ReqQueryParams'
import { blacklist } from '../lib'

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
    this.app.get('/assets', server.handleRequest(this.getAssets))
  }

  async getAssets(req) {
    const baseQueryParams = new ReqQueryParams(req)
    const assetType = baseQueryParams.getReqParam('asset_type') // throws if undefined

    const PublicableAsset = new PublicationService().getPublicableAssetFromType(
      assetType
    )
    let result

    if (baseQueryParams.has('status')) {
      const queryParams = new MarketplaceQueryParams(req)
      result = await new Marketplace().filter(queryParams, PublicableAsset)
    } else {
      const queryParams = new AssetReqQueryParams(req)
      result = await new Asset(PublicableAsset).filter(queryParams)
    }

    return {
      assets: this.blacklistAssets(result.assets),
      total: result.total
    }
  }

  blacklistAssets(assets) {
    return assets.map(({ publication, ...asset }) => {
      const newAsset = utils.omit(asset, blacklist.asset)

      newAsset.publication = publication
        ? utils.omit(publication, blacklist.publication)
        : undefined

      return newAsset
    })
  }
}
