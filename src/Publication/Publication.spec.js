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
      const owner = '0xasdf'
      const tx_status = txUtils.TRANSACTION_STATUS.confirmed
      let expires_at = new Date()
      expires_at.setMonth(expires_at.getMonth() + 3)
      expires_at = expires_at.getTime().toString()
      const block_number = 1

      const soldPublication = {
        tx_hash: '0x1',
        contract_id: '0x1',
        x: 0,
        y: 0,
        price: 3,
        status: Publication.STATUS.sold,
        expires_at,
        owner,
        tx_status,
        block_number
      }
      const publicationRows = [
        soldPublication,
        {
          tx_hash: '0x2',
          contract_id: '0x2',
          x: 0,
          y: 1,
          price: 20,
          expires_at,
          owner,
          tx_status,
          block_number
        },
        {
          tx_hash: '0x3',
          contract_id: '0x3',
          x: 1,
          y: 1,
          price: 50,
          expires_at,
          owner,
          tx_status,
          block_number
        },
        {
          tx_hash: '0x4',
          contract_id: '0x4',
          x: 1,
          y: 2,
          price: 40,
          expires_at,
          owner,
          tx_status,
          block_number
        }
      ]
      const inserts = publicationRows.map(publication =>
        Publication.insert(publication)
      )
      await Promise.all(inserts)

      const { publications, total } = await new PublicationService().filter(
        filters
      )

      expect(publications).to.equalRows([
        {
          tx_hash: '0x4',
          contract_id: '0x4',
          x: 1,
          y: 2,
          price: 40,
          buyer: null,
          status: Publication.STATUS.open,
          expires_at,
          owner,
          tx_status,
          block_number
        }
      ])
      expect(total).to.be.equal(3)
    })
  })

  afterEach(() => db.truncate(Publication.tableName))
})
