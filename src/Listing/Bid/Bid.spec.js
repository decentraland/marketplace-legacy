import { expect } from 'chai'

import { Bid } from './Bid.model'
import { db } from '../../database'
import { LISTING_ASSET_TYPES, LISTING_STATUS } from '../../shared/listing'

describe('Bid', function() {
  const timeCreated = Date.now()

  beforeEach(async function() {
    await Bid.insert({
      id: '1',
      token_address: '0x000000000000000000000000000000000000000a',
      token_id: '1',
      bidder: '0x000000000000000000000000000000000000000b',
      price: 10,
      expires_at: 6000000,
      fingerprint: '0x',
      asset_type: LISTING_ASSET_TYPES.parcel,
      asset_id: '1',
      block_time_created_at: timeCreated,
      status: LISTING_STATUS.open,
      seller: null
    })

    await Bid.insert({
      id: '2',
      token_address: '0x000000000000000000000000000000000000000a',
      token_id: '1',
      bidder: '0x000000000000000000000000000000000000000c',
      price: 10,
      expires_at: 6000000,
      fingerprint: '0x',
      asset_type: LISTING_ASSET_TYPES.parcel,
      asset_id: '1',
      block_time_created_at: timeCreated,
      status: LISTING_STATUS.open,
      seller: null
    })

    await Bid.insert({
      id: '3',
      token_address: '0x000000000000000000000000000000000000000a',
      token_id: '1',
      bidder: '0x000000000000000000000000000000000000000d',
      price: 10,
      expires_at: 6000000,
      fingerprint: '0x',
      asset_type: LISTING_ASSET_TYPES.parcel,
      asset_id: '1',
      block_time_created_at: timeCreated,
      status: LISTING_STATUS.sold,
      seller: null
    })
  })

  describe('#findByAssetId', function() {
    it('should return an array of bids', async function() {
      const bids = await Bid.findByAssetId('1', LISTING_ASSET_TYPES.parcel)
      expect(bids.length).to.be.equal(3)
      expect(bids).to.equalRows([
        {
          id: '3',
          token_address: '0x000000000000000000000000000000000000000a',
          token_id: '1',
          bidder: '0x000000000000000000000000000000000000000d',
          price: 10,
          expires_at: '6000000',
          fingerprint: '0x',
          asset_type: LISTING_ASSET_TYPES.parcel,
          asset_id: '1',
          block_time_created_at: timeCreated.toString(),
          status: LISTING_STATUS.sold,
          block_time_updated_at: null,
          seller: null
        },
        {
          id: '2',
          token_address: '0x000000000000000000000000000000000000000a',
          token_id: '1',
          bidder: '0x000000000000000000000000000000000000000c',
          price: 10,
          expires_at: '6000000',
          fingerprint: '0x',
          asset_type: LISTING_ASSET_TYPES.parcel,
          asset_id: '1',
          block_time_created_at: timeCreated.toString(),
          status: LISTING_STATUS.open,
          block_time_updated_at: null,
          seller: null
        },
        {
          id: '1',
          token_address: '0x000000000000000000000000000000000000000a',
          token_id: '1',
          bidder: '0x000000000000000000000000000000000000000b',
          price: 10,
          expires_at: '6000000',
          fingerprint: '0x',
          asset_type: LISTING_ASSET_TYPES.parcel,
          asset_id: '1',
          block_time_created_at: timeCreated.toString(),
          status: LISTING_STATUS.open,
          block_time_updated_at: null,
          seller: null
        }
      ])
    })
  })

  describe('#findByAssetId', function() {
    it('should return an array of bids', async function() {
      let bids = await Bid.findByAssetIdWithStatus(
        '1',
        LISTING_ASSET_TYPES.parcel,
        LISTING_STATUS.open
      )

      expect(bids.length).to.be.equal(2)
      expect(bids).to.equalRows([
        {
          id: '2',
          token_address: '0x000000000000000000000000000000000000000a',
          token_id: '1',
          bidder: '0x000000000000000000000000000000000000000c',
          price: 10,
          expires_at: '6000000',
          fingerprint: '0x',
          asset_type: LISTING_ASSET_TYPES.parcel,
          asset_id: '1',
          block_time_created_at: timeCreated.toString(),
          status: LISTING_STATUS.open,
          block_time_updated_at: null,
          seller: null
        },
        {
          id: '1',
          token_address: '0x000000000000000000000000000000000000000a',
          token_id: '1',
          bidder: '0x000000000000000000000000000000000000000b',
          price: 10,
          expires_at: '6000000',
          fingerprint: '0x',
          asset_type: LISTING_ASSET_TYPES.parcel,
          asset_id: '1',
          block_time_created_at: timeCreated.toString(),
          status: LISTING_STATUS.open,
          block_time_updated_at: null,
          seller: null
        }
      ])

      bids = await Bid.findByAssetIdWithStatus(
        '1',
        LISTING_ASSET_TYPES.parcel,
        LISTING_STATUS.sold
      )

      expect(bids.length).to.be.equal(1)
      expect(bids).to.equalRows([
        {
          id: '3',
          token_address: '0x000000000000000000000000000000000000000a',
          token_id: '1',
          bidder: '0x000000000000000000000000000000000000000d',
          price: 10,
          expires_at: '6000000',
          fingerprint: '0x',
          asset_type: LISTING_ASSET_TYPES.parcel,
          asset_id: '1',
          block_time_created_at: timeCreated.toString(),
          status: LISTING_STATUS.sold,
          block_time_updated_at: null,
          seller: null
        }
      ])
    })
  })

  afterEach(() => Promise.all([Bid].map(Model => db.truncate(Model.tableName))))
})
