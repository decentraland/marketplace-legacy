import { ReqQueryParams } from './ReqQueryParams'
import { MarketplaceReqQueryParams } from './MarketplaceReqQueryParams'
import { Publication } from '../Publication'
import { PUBLICATION_ASSET_TYPES } from '../shared/publication'

export class AssetReqQueryParams {
  constructor(req) {
    this.reqQueryParams = new ReqQueryParams(req)
    this.marketplaceReqQueryParams = new MarketplaceReqQueryParams(this.req)
  }

  sanitize() {
    const {
      asset_type,
      ...queryParams
    } = this.marketplaceReqQueryParams.sanitize()

    queryParams.asset_type = Publication.isValidAssetType(asset_type)
      ? asset_type
      : PUBLICATION_ASSET_TYPES.parcel

    return queryParams
  }
}
