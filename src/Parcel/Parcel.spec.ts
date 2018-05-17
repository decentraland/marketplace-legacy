import { expect } from 'chai'
import * as sinon from 'sinon'
import { txUtils } from 'decentraland-eth'

import { db } from '../database'
import { Parcel, ParcelAttributes } from './Parcel.model'
import { ParcelService } from './Parcel.service'
import { coordinates } from './coordinates'
import { Publication } from '../Publication'

describe('Parcel', function() {
  describe('.buildId', function() {
    it('should concat both coordinates with pipes', function() {
      expect(Parcel.buildId(22, '30')).to.equal('22,30')
      expect(Parcel.buildId(0, 0)).to.equal('0,0')
    })

    it('should throw if any coordinate is invalid', function() {
      expect(() => Parcel.buildId(22, null)).to.throw(
        'You need to supply both coordinates to be able to hash them. x = 22 y = null'
      )
      expect(() => Parcel.buildId(undefined, 'y coord')).to.throw(
        'You need to supply both coordinates to be able to hash them. x = undefined y = y coord'
      )
    })
  })

  describe('.inRange', function() {
    beforeEach(() => new ParcelService().insertMatrix(0, 0, 10, 10))

    it('should return an array of parcels which are on the supplied range', async function() {
      const range = await Parcel.inRange([2, 5], [5, 3])
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
        tx_status: txUtils.TRANSACTION_STATUS.confirmed,
        status: Publication.STATUS.open,
        type: Publication.TYPES.parcel,
        asset_id: '3,5',
        owner: '0xdeadbeef33',
        buyer: null,
        price: 1500,
        expires_at: new Date().getTime() * 1000,
        contract_id: '0xdeadbeef',
        block_time_created_at: null,
        block_time_updated_at: null,
        marketplace_id: '0x113322',
        block_number: 1
      }
      await Publication.insert(publication)

      const range = await Parcel.inRange([3, 5], [4, 5])

      expect(range).to.equalRows([
        {
          x: 3,
          y: 5,
          asset_id: null,
          auction_price: null,
          owner: null,
          data: null,
          district_id: null,
          in_estate: false,
          last_transferred_at: null,
          auction_owner: null,
          tags: {},
          publication
        },
        {
          x: 4,
          y: 5,
          asset_id: null,
          auction_price: null,
          owner: null,
          data: null,
          district_id: null,
          in_estate: false,
          last_transferred_at: null,
          auction_owner: null,
          tags: {},
          publication: null
        }
      ])
    })
  })

  afterEach(() =>
    Promise.all(
      [Parcel, Publication].map(Model => db.truncate(Model.tableName))
    )
  )
})

describe('ParcelService', function() {
  const parcelAttributes = {
    asset_id: '1.101e10',
    owner: '0xdeadbeef',
    district_id: null,
    in_state: false,
    data: { version: '0' },
    tags: {},
    auction_price: 1000,
    auction_owner: '0x222111333',
    last_transferred_at: 123123123
  }
  function getParcelAttributes(
    x: number,
    y: number,
    hasId: boolean = false
  ): ParcelAttributes {
    const attributes: ParcelAttributes = { x, y, ...parcelAttributes }
    if (hasId) {
      attributes.id = Parcel.buildId(x, y)
    }
    return attributes
  }
  const testParcel1 = getParcelAttributes(1, 2)
  const testParcel2 = getParcelAttributes(-7, 5)

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
    isTestParcel(x, y) {
      return (
        (testParcel1.x === x && testParcel1.y === y) ||
        (testParcel2.x === x && testParcel2.y === y)
      )
    }
  }

  describe('#insertMatrix', function() {
    it('should call the `insert` method of Parcel for each element of the matrix', async function() {
      const ParcelMock = Object.create(Parcel)
      ParcelMock.insert = () => Promise.resolve()

      const spy = sinon.spy(ParcelMock, 'insert')

      const service = new ParcelService()
      service.Parcel = ParcelMock

      await service.insertMatrix(0, 0, 1, 2)

      expect(spy.callCount).to.be.equal(6)
      sinon.assert.calledWithExactly(spy, { x: 0, y: 0 })
      sinon.assert.calledWithExactly(spy, { x: 0, y: 1 })
      sinon.assert.calledWithExactly(spy, { x: 0, y: 2 })
      sinon.assert.calledWithExactly(spy, { x: 1, y: 0 })
      sinon.assert.calledWithExactly(spy, { x: 1, y: 1 })
      sinon.assert.calledWithExactly(spy, { x: 1, y: 2 })
    })

    it('should skip already created parcels', function() {
      const error =
        'duplicate key value violates unique constraint "parcel_pkey"'

      const ParcelMock = Object.create(Parcel)
      ParcelMock.insert = () => Promise.reject(error)

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
      const DataError = function(message: string) {
        this.name = 'DataError'
        this.message = message
      }

      const service = new ParcelService()
      sinon.stub(service, 'getLANDRegistryContract').returns({
        landData: () => {
          throw new DataError('Expected spy error')
        }
      })

      const result = await service.addLandData([getParcelAttributes(-22, 42)])
      const datas = result.map(parcel => parcel.data)

      expect(datas).to.deep.equal([{ version: 0 }])
    })
  })

  describe('#isOwner', function() {
    it('should return true if the parcel belongs to the address', async function() {
      const service = new ParcelService()
      sinon.stub(service, 'getLANDRegistryContract').returns(contract)

      const result = await service.isOwner(txUtils.DUMMY_TX_ID, testParcel1)
      expect(result).to.be.equal(true)
    })

    it('should return false if the parcel belongs to someone else', async function() {
      const service = new ParcelService()
      sinon.stub(service, 'getLANDRegistryContract').returns(contract)

      const wrongParcel = await service.isOwner(
        txUtils.DUMMY_TX_ID,
        getParcelAttributes(10, -2)
      )
      const wrongAddr = await service.isOwner('0xnothing', testParcel1)

      expect(wrongAddr).to.be.equal(false)
      expect(wrongParcel).to.be.equal(false)
    })
  })

  describe('#addOwners', function() {
    it('should use the LANDRegistry contract to add the avaiable owner addresses', async function() {
      const service = new ParcelService()
      sinon.stub(service, 'getLANDRegistryContract').returns(contract)

      const parcels = [testParcel1, testParcel2, getParcelAttributes(11, -2)]
      const parcelsWithOwner = await service.addOwners(parcels)

      expect(parcelsWithOwner).to.deep.equal([
        { ...parcels[0], owner: '0xdeadbeef' },
        { ...parcels[1], owner: '0xdeadbeef' },
        { ...parcels[2], owner: null }
      ])
    })
  })
})

describe('coordinates', function() {
  describe('.checkIsValid', function() {
    it('should throw if the supplied coordinates are invalid', function() {
      expect(() => coordinates.checkIsValid('a,b')).to.throw(
        'The coordinate "a,b" are not valid'
      )
      expect(() => coordinates.checkIsValid([1, null])).to.throw(
        'The coordinate "1," are not valid'
      )
      expect(() => coordinates.checkIsValid('1,2  b')).to.throw(
        'The coordinate "1,2  b" are not valid'
      )
      expect(() => coordinates.checkIsValid('')).to.throw(
        'The coordinate "" are not valid'
      )
    })

    it('should not throw if the supplied coordinates valid', function() {
      expect(() => coordinates.checkIsValid('1,2')).not.to.throw()
      expect(() => coordinates.checkIsValid('-1,2')).not.to.throw()
      expect(() => coordinates.checkIsValid('1,-2')).not.to.throw()
      expect(() => coordinates.checkIsValid([22, 23])).not.to.throw()
      expect(() => coordinates.checkIsValid('1,   2')).not.to.throw()
    })
  })

  describe('.splitPairs', function() {
    it('should return an object of x[] and y[] properties', function() {
      const result = coordinates.splitPairs([
        { x: 1, y: 2 },
        { x: 5, y: 3 },
        { x: -1, y: -2 },
        { x: 9, y: -7 }
      ])
      expect(result).to.deep.equal({
        x: [1, 5, -1, 9],
        y: [2, 3, -2, -7]
      })
    })

    it('should throw if the coordinates are invalid', function() {
      expect(() => coordinates.toArray('a,  2')).to.throw(
        'The coordinate "a,  2" are not valid'
      )
    })
  })

  describe('.toArray', function() {
    it('should return an array composed from the supplied coordinates', function() {
      expect(coordinates.toArray('1,  2')).to.deep.equal([1, 2])
    })

    it('should throw if the coordinates are invalid', function() {
      expect(() => coordinates.toArray('a,  2')).to.throw(
        'The coordinate "a,  2" are not valid'
      )
    })
  })
})
