import { expect } from 'chai'
import { txUtils } from 'decentraland-eth'

import { db } from '../database'
import { Parcel, ParcelService } from '../Parcel'
import { Publication, PublicationRequestFilters } from '../Publication'
import { Asset } from './Asset'

describe('Asset', function() {
  const filters = new PublicationRequestFilters(null)
  filters.sanitize = () => ({
    status: Publication.STATUS.open,
    type: Publication.TYPES.parcel,
    sort: {
      by: 'price',
      order: 'desc'
    },
    pagination: {
      limit: 1,
      offset: 1
    }
  })

  describe('#filter', function() {
    it('should filter the published assets using the supplied filters', async function() {
      // Setup
      const owner = '0xasdf'
      const tx_status = txUtils.TRANSACTION_STATUS.confirmed
      const status = Publication.STATUS.open
      const block_number = 1
      const block_time_created_at = null
      const block_time_updated_at = null
      const marketplace_id = '0xdeadbeef'

      let expiresAt = new Date()
      expiresAt.setMonth(expiresAt.getMonth() + 3)
      const expires_at = expiresAt.getTime()

      const soldPublication = {
        tx_hash: '0x1',
        contract_id: '0x1',
        asset_id: '0,0',
        price: 3,
        status: Publication.STATUS.sold,
        expires_at,
        owner,
        tx_status,
        block_time_created_at,
        block_time_updated_at,
        marketplace_id,
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
          marketplace_id,
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
          marketplace_id,
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
          marketplace_id,
          block_number
        }
      ]

      // Inserts
      const inserts: Promise<any>[] = publicationRows.map(publication =>
        Publication.insert(publication)
      )
      inserts.push(new ParcelService().insertMatrix(0, 0, 3, 3))
      await Promise.all(inserts)

      // Filter
      const { assets, total } = await new Asset(Parcel).filter(filters)

      expect(assets).to.equalRows([
        {
          x: 1,
          y: 2,
          asset_id: null,
          auction_price: null,
          district_id: null,
          last_transferred_at: null,
          owner: null,
          data: null,
          auction_owner: null,
          tags: {},
          in_estate: false,
          publication: {
            tx_hash: '0x4',
            contract_id: '0x4',
            price: 40,
            buyer: null,
            status: Publication.STATUS.open,
            type: Publication.TYPES.parcel,
            asset_id: '1,2',
            expires_at,
            owner,
            tx_status,
            block_time_created_at,
            block_time_updated_at,
            marketplace_id,
            block_number
          }
        }
      ])
      expect(total).to.be.equal(3)
    })
  })

  afterEach(() =>
    Promise.all(
      [Parcel, Publication].map(Model => db.truncate(Model.tableName))
    )
  )
})
