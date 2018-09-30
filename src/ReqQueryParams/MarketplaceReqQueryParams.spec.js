import { expect } from 'chai'

import { MarketplaceReqQueryParams } from './MarketplaceReqQueryParams'
import { ASSET_TYPES } from '../shared/asset'
import { PUBLICATION_STATUS } from '../shared/publication'

describe('MarketplaceReqQueryParams', function() {
  const buildRequest = request => ({
    headers: {},
    ...request
  })

  describe('.sanitize', function() {
    it('should return an object obtaining the data from the request', function() {
      const request = buildRequest({
        query: {
          status: PUBLICATION_STATUS.sold,
          asset_type: ASSET_TYPES.estate,
          sort_by: 'price',
          sort_order: 'desc',
          limit: 33,
          offset: 10
        }
      })

      const filters = new MarketplaceReqQueryParams(request)
      expect(filters.sanitize()).to.deep.equal({
        status: PUBLICATION_STATUS.sold,
        asset_type: ASSET_TYPES.estate,
        sort: {
          by: 'price',
          order: 'ASC'
        },
        pagination: {
          limit: 33,
          offset: 10
        }
      })
    })

    it('should only allow pre-determined values', function() {
      const request = buildRequest({
        query: {
          status: '--SELECT * FROM publications;',
          asset_type: '--UPDATE parcels set x = 9999;--',
          sort_by: ';/**/DELETE * FROM publications;',
          sort_order: ';/**/;',
          limit: 10000,
          offset: -100
        }
      })

      const filters = new MarketplaceReqQueryParams(request)
      expect(filters.sanitize()).to.deep.equal({
        status: PUBLICATION_STATUS.open,
        asset_type: ASSET_TYPES.parcel,
        sort: {
          by: 'created_at',
          order: 'DESC'
        },
        pagination: {
          limit: 100,
          offset: 0
        }
      })
    })
  })
})
