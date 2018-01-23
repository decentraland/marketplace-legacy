import { expect } from 'chai'
import sinon from 'sinon'
import { LANDRegistry } from 'decentraland-contracts'
import { tx, utils } from 'decentraland-commons'

import db from '../database'
import Parcel from './Parcel'
import ParcelService from './Parcel.service'
import coordinates from './coordinates'

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

  describe('.findInCoordinates', function() {
    it('should attach an array of bid groups for the address', async function() {
      await new ParcelService().insertMatrix(-1, -1, 3, 3)

      const result = await Parcel.findInCoordinates([
        '1,2',
        '3,3',
        '4,4',
        '0,0',
        '-1,-1'
      ])

      expect(result.length).to.be.equal(4)
    })

    it('should throw if any coordinate is invalid', function() {
      return expect(
        Parcel.findInCoordinates(['1,1', 'nonsense'])
      ).to.be.rejectedWith('The coordinate "nonsense" are not valid')
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
  const testParcel1 = { x: '1', y: '2' }
  const testParcel2 = { x: '-7', y: '5' }
  const testAddress = '0xfede'

  const contract = {
    ownerOfLand(x, y) {
      const isDummy = testParcel1.x === x && testParcel1.y === y
      return isDummy ? tx.DUMMY_TX_ID : null
    },
    ownerOfLandMany(x, y) {
      const isDummy =
        testParcel1.x === x[0] &&
        testParcel1.y === y[0] &&
        testParcel2.x === x[1] &&
        testParcel2.y === y[1]

      return isDummy ? [tx.DUMMY_TX_ID, tx.DUMMY_TX_ID] : null
    },
    landOf(address) {
      return address === testAddress
        ? [[testParcel1.x, testParcel2.x], [testParcel1.y, testParcel2.y]]
        : [[], []]
    }
  }

  describe('#insertMatrix', function() {
    it('should call the `insert` method of parcel state for each element of the matrix', async function() {
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
        'duplicate key value violates unique constraint "parcel_states_pkey"'

      const ParcelMock = { insert: () => Promise.reject(error) }
      const service = new ParcelService()
      service.Parcel = ParcelMock

      const matrix = service.insertMatrix(0, 0, 1, 1)

      return expect(matrix).not.to.be.rejectedWith(error)
    })
  })

  describe('#isOwner', function() {
    it('should return true if the parcel belongs to the address', async function() {
      const service = new ParcelService()
      sinon.stub(service, 'getLANDRegistryContract').returns(contract)

      const result = await service.isOwner(tx.DUMMY_TX_ID, testParcel1)
      expect(result).to.be.true
    })

    it('should return false if the parcel belongs to someone else', async function() {
      const service = new ParcelService()
      sinon.stub(service, 'getLANDRegistryContract').returns(contract)

      const wrongParcel = await service.isOwner(tx.DUMMY_TX_ID, {
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

      const parcels = [testParcel1, testParcel2, { x: '11', y: '-2' }]
      const parcelsWithOwner = await service.addOwners(parcels)

      expect(parcelsWithOwner).to.deep.equal([
        { x: '1', y: '2', owner: '0xdeadbeef' }, // testParcel1
        { x: '-7', y: '5', owner: '0xdeadbeef' }, // testParcel2
        { x: '11', y: '-2', owner: null }
      ])
    })

    it('should return the same array if the LANDRegistry contract fails', async function() {
      const service = new ParcelService()
      sinon.stub(service, 'getLANDRegistryContract').throws()

      const parcels = [testParcel1, testParcel2]
      const parcelsWithOwner = await service.addOwners(parcels)

      expect(parcelsWithOwner).to.equal(parcels)
    })
  })

  describe('#getLandOf', function() {
    it('should return an array of {x, y} pairs from the lands the address owns', async function() {
      const service = new ParcelService()
      sinon.stub(service, 'getLANDRegistryContract').returns(contract)

      const landPairs = await service.getLandOf(testAddress)

      expect(landPairs).to.deep.equal([testParcel1, testParcel2])
    })

    it('should return an empty array on error', async function() {
      const service = new ParcelService()
      sinon.stub(service, 'getLANDRegistryContract').throws()

      const landPairs = await service.getLandOf(testAddress)

      expect(landPairs).to.deep.equal([])
    })
  })

  describe('#addDbData', function() {
    it('should add the data stored on the db to each parcel and return a new array', async function() {
      const contractParcels = [
        { x: 0, y: 0 },
        { x: 10, y: -2 },
        { x: -5, y: 20 }
      ]
      const parcelData = [
        { name: 'Name 1', description: 'Description 1', price: '1000' },
        { name: 'Name 2', description: 'Description 2', price: '1250' },
        { name: 'Name 3', description: 'Description 3', price: '5234' }
      ]
      const parcels = contractParcels.map((coord, index) =>
        Object.assign({}, coord, parcelData[index])
      )

      // inserts a new parcel object to avoid adding an `id` to the list
      const inserts = parcels.map(parcel => Parcel.insert({ ...parcel }))
      await Promise.all(inserts)

      const parcelsWithData = await new ParcelService().addDbData(
        contractParcels
      )

      expect(parcelsWithData).to.deep.equal(parcels)
    })

    afterEach(() => db.truncate('parcels'))
  })

  describe('#getValuesFromSignedMessage', function() {
    it('should return an object with each value it finds on the message text, following the extract convention', async function() {
      const values = {
        id: null,
        x: 42,
        y: null,
        name: 'Name of the parcel',
        description: 'Super description'
      }

      const signedMessage = {
        extract(columnNames) {
          expect(columnNames).to.deep.equal(Parcel.columnNames)
          return Object.values(values)
        }
      }

      const signedValues = await new ParcelService().getValuesFromSignedMessage(
        signedMessage
      )

      const result = utils.omit(values, ['id', 'y']) // remove nulls
      expect(signedValues).to.deep.equal(result)
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
      expect(coordinates.toArray('1,  2')).to.deep.equal(['1', '2'])
    })

    it('should throw if the coordinates are invalid', function() {
      expect(() => coordinates.toArray('a,  2')).to.throw(
        'The coordinate "a,  2" are not valid'
      )
    })
  })
})
