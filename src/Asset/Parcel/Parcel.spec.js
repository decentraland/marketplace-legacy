import { expect } from 'chai'
import sinon from 'sinon'
import { eth, txUtils } from 'decentraland-eth'

import { Parcel } from './Parcel.model'
import { ParcelService } from './Parcel.service'
import { Publication } from '../../Publication'
import { Mortgage } from '../../Mortgage'
import { db } from '../../database'

import { ASSET_TYPES } from '../../shared/asset'
import { PUBLICATION_STATUS } from '../../shared/publication'
import { MORTGAGE_STATUS } from '../../shared/mortgage'

describe('Parcel', function() {
  describe('.buildId', function() {
    it('should concat both coordinates with pipes', function() {
      expect(Parcel.buildId(22, '30')).to.equal('22,30')
      expect(Parcel.buildId(0, 0)).to.equal('0,0')
    })

    it('should throw if any coordinate is invalid', function() {
      expect(() => Parcel.buildId(22)).to.throw(
        'You need to supply both coordinates to be able to hash them. x = 22 y = undefined'
      )
      expect(() => Parcel.buildId(undefined, 'y coord')).to.throw(
        'You need to supply both coordinates to be able to hash them. x = undefined y = y coord'
      )
    })
  })

  describe('.inRange', function() {
    beforeEach(() => new ParcelService().insertMatrix(0, 0, 10, 10))

    it('should return an array of parcels which are on the supplied range', async function() {
      const range = await Parcel.inRange({ x: 2, y: 5 }, { x: 5, y: 3 })
      const coordinates = range.map(coord => `${coord.x},${coord.y}`).sort()

      expect(range.length).to.be.equal(12)
      expect(coordinates).to.be.deep.equal([
        '2,3',
        '2,4',
        '2,5',
        '3,3',
        '3,4',
        '3,5',
        '4,3',
        '4,4',
        '4,5',
        '5,3',
        '5,4',
        '5,5'
      ])
    })

    it('should join the last open publication', async function() {
      const publication = {
        tx_hash: '0xdeadbeef',
        tx_status: txUtils.TRANSACTION_TYPES.confirmed,
        status: PUBLICATION_STATUS.open,
        asset_type: ASSET_TYPES.parcel,
        asset_id: '3,5',
        owner: '0xdeadbeef33',
        buyer: null,
        price: 1500,
        expires_at: new Date().getTime() * 1000,
        contract_id: '0xdeadbeef',
        block_time_created_at: null,
        block_time_updated_at: null,
        marketplace_address: '0x113322',
        block_number: 1
      }
      await Publication.insert(publication)

      const range = await Parcel.inRange({ x: 3, y: 5 }, { x: 4, y: 5 })
      expect(range).to.equalRows([
        {
          x: 3,
          y: 5,
          token_id: null,
          update_operator: null,
          auction_price: null,
          owner: null,
          data: null,
          district_id: null,
          estate_id: null,
          last_transferred_at: null,
          auction_owner: null,
          tags: {},
          publication
        },
        {
          x: 4,
          y: 5,
          token_id: null,
          update_operator: null,
          auction_price: null,
          owner: null,
          data: null,
          district_id: null,
          estate_id: null,
          last_transferred_at: null,
          auction_owner: null,
          tags: {},
          publication: null
        }
      ])
    })
  })

  describe('.findWithLastActiveMortgageByBorrower', function() {
    beforeEach(() => new ParcelService().insertMatrix(0, 0, 10, 10))

    it('should return parcels with mortgages by borrower', async function() {
      const publication = {
        tx_hash: '0xdeadbeef',
        tx_status: txUtils.TRANSACTION_TYPES.confirmed,
        status: PUBLICATION_STATUS.open,
        asset_type: ASSET_TYPES.parcel,
        asset_id: '2,5',
        owner: '0xdeadbeef33',
        buyer: null,
        price: 1500,
        expires_at: new Date().getTime() * 1000,
        contract_id: '0xdeadbeef',
        block_time_created_at: null,
        block_time_updated_at: null,
        marketplace_address: '0x113322',
        block_number: 1
      }
      const publication2 = {
        tx_hash: '0xdeadabeef',
        tx_status: txUtils.TRANSACTION_TYPES.confirmed,
        status: PUBLICATION_STATUS.open,
        asset_type: ASSET_TYPES.parcel,
        asset_id: '6,5',
        owner: '0xdeadbeef33',
        buyer: null,
        price: 1500,
        expires_at: new Date().getTime() * 1000,
        contract_id: '0xdseadbeef',
        block_time_created_at: null,
        block_time_updated_at: null,
        marketplace_address: '0x113322',
        block_number: 1
      }
      await Promise.all([
        Publication.insert(publication),
        Publication.insert(publication2)
      ])

      const mortgage = {
        tx_hash: '1xdeadbeef',
        tx_status: txUtils.TRANSACTION_TYPES.confirmed,
        status: MORTGAGE_STATUS.pending,
        loan_id: 0,
        mortgage_id: 0,
        asset_id: Parcel.buildId(2, 5),
        asset_type: ASSET_TYPES.parcel,
        borrower: '0xdeadbeef33',
        lender: null,
        is_due_at: 10000,
        payable_at: 1000,
        amount: 1500,
        interest_rate: 0,
        punitory_interest_rate: 0,
        outstanding_amount: 1500,
        expires_at: new Date().getTime() * 1000,
        block_time_created_at: null,
        block_time_updated_at: null,
        block_number: 1
      }
      const mortgage2 = Object.assign({}, mortgage, {
        tx_hash: '2xdeadbeff',
        loan_id: 2,
        mortgage_id: 2,
        borrower: '0xdeadbeef34'
      })
      const mortgage3 = Object.assign({}, mortgage, {
        tx_hash: '3xdeadbdff',
        asset_id: Parcel.buildId(5, 5),
        loan_id: 3,
        mortgage_id: 3,
        status: MORTGAGE_STATUS.cancelled,
        borrower: '0xdeadbeef33'
      })
      const mortgage4 = Object.assign({}, mortgage, {
        tx_hash: '4xdeadbeff',
        asset_id: Parcel.buildId(6, 5),
        loan_id: 4,
        mortgage_id: 4,
        status: MORTGAGE_STATUS.ongoing,
        borrower: '0xdeadbeef33'
      })
      await Promise.all([
        Mortgage.insert(mortgage),
        Mortgage.insert(mortgage2),
        Mortgage.insert(mortgage3),
        Mortgage.insert(mortgage4)
      ])

      const range = await Parcel.findWithLastActiveMortgageByBorrower(
        '0xdeadbeef33'
      )
      expect(range.length).to.be.equal(2)
      expect(range).to.equalRows([
        {
          token_id: null,
          x: 2,
          y: 5,
          update_operator: null,
          auction_price: null,
          owner: null,
          data: null,
          district_id: null,
          last_transferred_at: null,
          auction_owner: null,
          estate_id: null,
          tags: {},
          publication
        },
        {
          token_id: null,
          x: 6,
          y: 5,
          update_operator: null,
          auction_price: null,
          owner: null,
          data: null,
          district_id: null,
          last_transferred_at: null,
          auction_owner: null,
          estate_id: null,
          tags: {},
          publication: publication2
        }
      ])
    })
  })

  afterEach(() =>
    Promise.all(
      [Parcel, Publication, Mortgage].map(Model => db.truncate(Model.tableName))
    ))
})

describe('ParcelService', function() {
  const testParcel1 = { x: 1, y: 2 }
  const testParcel2 = { x: -7, y: 5 }

  const testParcel1WithId = {
    ...testParcel1,
    id: Parcel.buildId(testParcel1.x, testParcel1.y)
  }
  const testParcel2WithId = {
    ...testParcel2,
    id: Parcel.buildId(testParcel2.x, testParcel2.y)
  }

  const testAddress = '0xfede'

  const contract = {
    ownerOfLand(x, y) {
      return this.isTestParcel(x, y) ? txUtils.DUMMY_TX_ID : null
    },
    ownerOfLandMany(xCoords, yCoords) {
      const isTestParcel =
        this.isTestParcel(xCoords[0], yCoords[0]) &&
        this.isTestParcel(xCoords[1], yCoords[1])

      return isTestParcel ? [txUtils.DUMMY_TX_ID, txUtils.DUMMY_TX_ID] : null
    },
    landData(x, y) {
      return this.isTestParcel(x, y)
        ? '0,awesome name,super description,ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY'
        : ''
    },
    landOf(address) {
      const result =
        address === testAddress
          ? [[testParcel1.x, testParcel2.x], [testParcel1.y, testParcel2.y]]
          : [[], []]

      return result.map(pair => pair.map(eth.utils.toBigNumber))
    },
    isTestParcel(x, y) {
      return (
        (testParcel1.x === x && testParcel1.y === y) ||
        (testParcel2.x === x && testParcel2.y === y)
      )
    }
  }

  describe('#insertMatrix', function() {
    it('should call the `insert` method of Parcel for each element of the matrix', async function() {
      const ParcelMock = { insert: () => Promise.resolve() }
      const spy = sinon.spy(ParcelMock, 'insert')

      const service = new ParcelService()
      service.Parcel = ParcelMock

      await service.insertMatrix(-1, -1, 1, 2)

      expect(spy.callCount).to.be.equal(12)
      expect(
        spy.calledWithExactly(
          sinon.match(
            { x: -1, y: -1 },
            { x: -1, y: 0 },
            { x: -1, y: 1 },
            { x: -1, y: 2 },
            { x: 0, y: -1 },
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: 2 },
            { x: 1, y: -1 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 1, y: 2 }
          )
        )
      ).to.be.true
    })

    it('should skip already created parcels', function() {
      const error =
        'duplicate key value violates unique constraint "parcel_pkey"'

      const ParcelMock = { insert: () => Promise.reject(error) }
      const service = new ParcelService()
      service.Parcel = ParcelMock

      const matrix = service.insertMatrix(0, 0, 1, 1)

      return expect(matrix).not.to.be.rejectedWith(error)
    })
  })

  describe('#addLandData', function() {
    it('should add the decoded land data to the parcel', async function() {
      const service = new ParcelService()
      sinon.stub(service, 'getLANDRegistryContract').returns(contract)

      const result = await service.addLandData([testParcel1])
      expect(result).to.deep.equal([
        {
          ...testParcel1,
          data: {
            version: 0,
            name: 'awesome name',
            description: 'super description',
            ipns: 'ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY'
          }
        }
      ])
    })

    it('should return an object with only the CURRENT_DATA_VERSION as property if the getter or decoding fails', async function() {
      const DataError = function() {
        this.name = 'DataError'
      }
      const service = new ParcelService()
      sinon.stub(service, 'getLANDRegistryContract').returns({
        landData: () => {
          throw new DataError('Expected spy error')
        }
      })

      const result = await service.addLandData([{ x: -22, y: 42 }])
      expect(result).to.deep.equal([
        {
          x: -22,
          y: 42,
          data: {
            version: 0
          }
        }
      ])
    })
  })

  describe('#isOwner', function() {
    it('should return true if the parcel belongs to the address', async function() {
      const service = new ParcelService()
      sinon.stub(service, 'getLANDRegistryContract').returns(contract)

      const result = await service.isOwner(txUtils.DUMMY_TX_ID, testParcel1)
      expect(result).to.be.true
    })

    it('should return false if the parcel belongs to someone else', async function() {
      const service = new ParcelService()
      sinon.stub(service, 'getLANDRegistryContract').returns(contract)

      const wrongParcel = await service.isOwner(txUtils.DUMMY_TX_ID, {
        x: 10,
        y: -2
      })
      const wrongAddr = await service.isOwner('0xnothing', testParcel1)

      expect(wrongAddr).to.be.false
      expect(wrongParcel).to.be.false
    })
  })

  describe('#addOwners', function() {
    it('should use the LANDRegistry contract to add the avaiable owner addresses', async function() {
      const service = new ParcelService()
      sinon.stub(service, 'getLANDRegistryContract').returns(contract)

      const parcels = [testParcel1, testParcel2, { x: 11, y: -2 }]
      const parcelsWithOwner = await service.addOwners(parcels)

      expect(parcelsWithOwner).to.deep.equal([
        { ...testParcel1, owner: '0xdeadbeef' },
        { ...testParcel2, owner: '0xdeadbeef' },
        { x: 11, y: -2, owner: null }
      ])
    })
  })

  describe('#getLandOf', function() {
    it('should return an array of {id, x, y} pairs from the lands the address owns', async function() {
      const service = new ParcelService()
      sinon.stub(service, 'getLANDRegistryContract').returns(contract)

      const landPairs = await service.getLandOf(testAddress)

      expect(landPairs).to.deep.equal([testParcel1WithId, testParcel2WithId])
    })
  })
})
