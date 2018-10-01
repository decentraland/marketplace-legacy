import { ReqQueryParams } from './ReqQueryParams'
import { MarketplaceReqQueryParams } from './MarketplaceReqQueryParams'

export class AssetReqQueryParams extends ReqQueryParams {
  sanitize() {
    // For now, both requests look the same
    return new MarketplaceReqQueryParams(this.req).sanitize()
  }
}
