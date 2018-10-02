import { expect } from 'chai'
import { txUtils } from 'decentraland-eth'

import { Marketplace } from './Marketplace'
import { Parcel, ParcelService } from '../Asset'
import { Publication } from '../Publication'
import { db } from '../database'
import { ASSET_TYPES } from '../shared/asset'
import { PUBLICATION_STATUS } from '../shared/publication'

describe('Marketplace', function() {
  const queryParams = {
    sanitize() {
      return {
        status: PUBLICATION_STATUS.open,
        asset_type: ASSET_TYPES.parcel,
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
    it('should filter the published assets using the supplied queryParams', async function() {
      // Setup
      const owner = '0xasdf'
      const tx_status = txUtils.TRANSACTION_TYPES.confirmed
      const status = PUBLICATION_STATUS.open
      const block_number = 1
      const block_time_created_at = null
      const block_time_updated_at = null
      const marketplace_address = '0xdeadbeef'

      let expires_at = new Date()
      expires_at.setMonth(expires_at.getMonth() + 3)
      expires_at = expires_at.getTime()

      const soldPublication = {
        tx_hash: '0x1',
        contract_id: '0x1',
        asset_id: '0,0',
        price: 3,
        status: PUBLICATION_STATUS.sold,
        expires_at,
        owner,
        tx_status,
        block_time_created_at,
        block_time_updated_at,
        marketplace_address,
        block_number
      }
      const publicationRows = [
        soldPublication,
        {
          tx_hash: '0x2',
          contract_id: '0x2',
          asset_id: '1,0',
          price: 20,
          expires_at,
          owner,
          tx_status,
          status,
          block_time_created_at,
          block_time_updated_at,
          marketplace_address,
          block_number
        },
        {
          tx_hash: '0x3',
          contract_id: '0x3',
          asset_id: '1,1',
          price: 50,
          expires_at,
          owner,
          tx_status,
          status,
          block_time_created_at,
          block_time_updated_at,
          marketplace_address,
          block_number
        },
        {
          tx_hash: '0x4',
          contract_id: '0x4',
          asset_id: '1,2',
          price: 40,
          expires_at,
          owner,
          tx_status,
          status,
          block_time_created_at,
          block_time_updated_at,
          marketplace_address,
          block_number
        }
      ]

      // Inserts
      const inserts = publicationRows.map(publication =>
        Publication.insert(publication)
      )
      inserts.push(new ParcelService().insertMatrix(0, 0, 3, 3))
      await Promise.all(inserts)

      // Filter
      const { assets, total } = await new Marketplace().filter(
        queryParams,
        Parcel
      )

      expect(assets).to.equalRows([
        {
          x: 1,
          y: 2,
          token_id: null,
          update_operator: null,
          auction_price: null,
          district_id: null,
          last_transferred_at: null,
          owner: null,
          data: null,
          auction_owner: null,
          tags: {},
          estate_id: null,
          publication: {
            tx_hash: '0x4',
            contract_id: '0x4',
            price: 40,
            buyer: null,
            status: PUBLICATION_STATUS.open,
            asset_type: ASSET_TYPES.parcel,
            asset_id: '1,2',
            expires_at,
            owner,
            tx_status,
            block_time_created_at,
            block_time_updated_at,
            marketplace_address,
            block_number
          }
        }
      ])
      expect(total).to.be.equal(3)
    })
  })

  afterEach(() =>
    [Parcel, Publication].map(Model => db.truncate(Model.tableName)))
})
