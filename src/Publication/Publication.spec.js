import { expect } from 'chai'
import { txUtils } from 'decentraland-commons'

import { db } from '../database'
import { Publication } from './Publication'
import { PublicationService } from './Publication.service'
import { PublicationRequestFilters } from './PublicationRequestFilters'

describe('Publication', function() {
  describe('.primaryKey', function() {
    it('should set the primary key to `tx_hash`', function() {
      expect(Publication.primaryKey).to.equal('tx_hash')
    })
  })
})

describe('PublicationRequestFilters', function() {
  const buildRequest = request => ({
    headers: {},
    ...request
  })

  describe('.sanitize', function() {
    it('should return an object obtaining the data from the request', function() {
      const request = buildRequest({
        query: {
          sort_by: 'price',
          sort_order: 'desc',
          limit: 33,
          offset: 10
        }
      })

      const filters = new PublicationRequestFilters(request)
      expect(filters.sanitize()).to.deep.equal({
        sort: {
          by: 'price',
          order: 'desc'
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
          sort_by: ';/**/DELETE * FROM publications;',
          sort_order: ';/**/;',
          limit: 10000,
          offset: -100
        }
      })

      const filters = new PublicationRequestFilters(request)
      expect(filters.sanitize()).to.deep.equal({
        sort: {
          by: 'created_at',
          order: 'ASC'
        },
        pagination: {
          limit: 20,
          offset: 0
        }
      })
    })
  })
})

describe('PublicationService', function() {
  const filters = {
    sanitize() {
      return {
        sort: {
          by: 'price',
          order: 'desc'
        },
        pagination: {
          limit: 1,
          offset: 1
        }
      }
    }
  }

  describe('#filter', function() {
    it('should filter the publications using the supplied filters', async function() {
      const address = '0xasdf'
      const tx_status = txUtils.TRANSACTION_STATUS.confirmed
      const soldPublication = {
        tx_hash: '0xdeadbeef1',
        x: 0,
        y: 0,
        price: 3,
        status: Publication.STATUS.sold,
        address,
        tx_status
      }
      const publicationRows = [
        soldPublication,
        { tx_hash: '0xdeadbeef2', x: 0, y: 1, price: 2000, address, tx_status },
        { tx_hash: '0xdeadbeef3', x: 1, y: 1, price: 5000, address, tx_status },
        { tx_hash: '0xdeadbeef4', x: 1, y: 2, price: 4000, address, tx_status }
      ]
      const inserts = publicationRows.map(publication =>
        Publication.insert(publication)
      )
      await Promise.all(inserts)

      const { publications, total } = await new PublicationService().filter(
        filters
      )

      expect(publications).to.be.equalRows([
        {
          tx_hash: '0xdeadbeef4',
          x: 1,
          y: 2,
          price: '4000',
          expires_at: null,
          status: Publication.STATUS.open,
          address,
          tx_status
        }
      ])
      expect(total).to.be.equal(3)
    })
  })

  afterEach(() => db.truncate('publications'))
})
