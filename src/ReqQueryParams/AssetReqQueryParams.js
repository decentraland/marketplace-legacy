import { ReqQueryParams } from './ReqQueryParams'
import { MarketplaceReqQueryParams } from './MarketplaceReqQueryParams'
import { Listing } from '../Listing'
import { LISTING_ASSET_TYPES } from '../shared/listing'

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

    queryParams.asset_type = Listing.isValidAssetType(asset_type)
      ? asset_type
      : LISTING_ASSET_TYPES.parcel

    return queryParams
  }
}
