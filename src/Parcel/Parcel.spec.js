import { expect } from 'chai'
import sinon from 'sinon'
import { LANDToken } from 'decentraland-contracts'

import db from '../database'
import Parcel from './Parcel'
import ParcelService from './Parcel.service'
import coordinates from './coordinates'

describe('Parcel', function() {
  describe('.hashId', function() {
    it('should concat both coordinates with pipes', function() {
      expect(Parcel.hashId(22, '30')).to.equal('22,30')
      expect(Parcel.hashId(0, 0)).to.equal('0,0')
    })

    it('should throw if any coordinate is invalid', function() {
      expect(() => Parcel.hashId(22)).to.throw(
        'You need to supply both coordinates to be able to hash them. x = 22 y = undefined'
      )
      expect(() => Parcel.hashId(undefined, 'y coord')).to.throw(
        'You need to supply both coordinates to be able to hash them. x = undefined y = y coord'
      )
    })
  })

  describe('.inRange', function() {
    it('should return an array of parcel states which are on the supplied range', async function() {
      await new ParcelService().insertMatrix(0, 0, 10, 10)

      const range = await Parcel.inRange([2, 3], [5, 5])
      const coordinates = range.map(coord => `${coord.x},${coord.y}`)

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
  })

  afterEach(() => db.truncate('parcels'))
})

describe('ParcelService', function() {
  let ParcelMock
  let parcelService

  beforeEach(() => {
    ParcelMock = { insert: () => Promise.resolve() }

    parcelService = new ParcelService()
    parcelService.Parcel = ParcelMock
  })

  describe('#insertMatrix', function() {
    it('should call the `insert` method of parcel state for each element of the matrix', async function() {
      const spy = sinon.spy(ParcelMock, 'insert')

      await parcelService.insertMatrix(-1, -1, 1, 2)

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
        'duplicate key value violates unique constraint "parcel_states_pkey"'

      sinon.stub(ParcelMock, 'insert').returns(Promise.reject(error))

      return expect(
        parcelService.insertMatrix(0, 0, 1, 1)
      ).not.to.be.rejectedWith(error)
    })
  })

  describe('#addPrices', async function() {
    it('should add the price fetched from the database to each parcel and return a new array', async function() {
      const coordinates = [
        { id: '0,0', x: 0, y: 0 },
        { id: '10,-2', x: 10, y: -2 },
        { id: '-5,20', x: -5, y: 20 }
      ]
      const prices = ['1000', '1250', '5234']

      const parcels = coordinates.map((coord, index) =>
        Object.assign({}, coord, { price: prices[index] })
      )

      await Promise.all(parcels.map(parcel => Parcel.insert(parcel)))

      const parcelService = new ParcelService()
      const parcelsWithPrice = await parcelService.addPrices(coordinates)

      expect(parcelsWithPrice).to.deep.equal(parcels)
    })

    it('should add a zero for missing coordinates', async function() {
      const coordinates = [{ x: 0, y: 0 }, { x: 10, y: -2 }, { x: -5, y: 20 }]
      const parcels = coordinates.map(coord =>
        Object.assign({}, coord, { price: 0 })
      )

      const parcelService = new ParcelService()
      const parcelsWithPrice = await parcelService.addPrices(coordinates)

      expect(parcelsWithPrice).to.deep.equal(parcels)
    })
  })

  describe('#addOwners', function() {
    const contract = {
      getOwner: (x, y) => (x === 1 && y === 2 ? '0xdeadbeef' : null)
    }

    it('should use the LANDToken contract to add the avaiable owner addresses', async function() {
      sinon.stub(LANDToken, 'getInstance').returns(contract)

      const coordinates = [{ x: -1, y: 10 }, { x: 1, y: 2 }]

      const parcelService = new ParcelService()
      const parcelsWithOwner = await parcelService.addOwners(coordinates)

      expect(parcelsWithOwner).to.deep.equal([
        { x: -1, y: 10, owner: null },
        { x: 1, y: 2, owner: '0xdeadbeef' }
      ])
    })

    it('should return the same array if the LANDToken contract fails', async function() {
      sinon.stub(LANDToken, 'getInstance').throws()

      const coordinates = [{ x: -1, y: 10 }, { x: 1, y: 2 }]

      const parcelService = new ParcelService()
      const parcelsWithOwner = await parcelService.addOwners(coordinates)

      expect(parcelsWithOwner).to.equal(coordinates)
    })

    afterEach(() => {
      LANDToken.getInstance.restore()
    })
  })

  afterEach(() => db.truncate('parcels'))
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

  describe('.toArray', function() {
    it('should return an array composed from the supplied coordinates', function() {
      expect(coordinates.toArray('1,  2')).to.deep.equal(['1', '2'])
    })

    it('should throw if the coordinates are invalid', function() {
      expect(() => coordinates.toArray('a,  2')).to.throw(
        'The coordinate "a,  2" are not valid'
      )
    })
  })
})
