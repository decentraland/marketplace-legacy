import { expect } from 'chai'
import sinon from 'sinon'

import db from '../db'
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

  afterEach(() => Promise.all(['parcel_states'].map(db.truncate.bind(db))))
})

describe('ParcelService', function() {
  let Parcel
  let parcelService

  beforeEach(() => {
    Parcel = { insert: () => Promise.resolve() }

    parcelService = new ParcelService()
    parcelService.Parcel = Parcel
  })

  describe('#insertMatrix', function() {
    it('should call the `insert` method of parcel state for each element of the matrix', async function() {
      const spy = sinon.spy(Parcel, 'insert')

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

      sinon.stub(Parcel, 'insert').returns(Promise.reject(error))

      return expect(
        parcelService.insertMatrix(0, 0, 1, 1)
      ).not.to.be.rejectedWith(error)
    })
  })

  describe('#addPrice', async function() {

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
