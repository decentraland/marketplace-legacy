import { expect } from 'chai'
import * as coordinates from './coordinates'

describe('coordinates', function() {
  describe('.validateCoordinate', function() {
    it('should throw if the supplied coordinate is invalid', function() {
      expect(() => coordinates.validateCoordinate('a,b')).to.throw(
        'The coordinate "a,b" is not valid'
      )
      expect(() => coordinates.validateCoordinate([1, null])).to.throw(
        'The coordinate "1," is not valid'
      )
      expect(() => coordinates.validateCoordinate('1,2  b')).to.throw(
        'The coordinate "1,2  b" is not valid'
      )
      expect(() => coordinates.validateCoordinate('')).to.throw(
        'The coordinate "" is not valid'
      )
    })

    it('should not throw if the supplied coordinates valid', function() {
      expect(() => coordinates.validateCoordinate('1,2')).not.to.throw()
      expect(() => coordinates.validateCoordinate('-1,2')).not.to.throw()
      expect(() => coordinates.validateCoordinate('1,-2')).not.to.throw()
      expect(() => coordinates.validateCoordinate([22, 23])).not.to.throw()
      expect(() => coordinates.validateCoordinate('1,   2')).not.to.throw()
    })
  })

  describe('.splitCoodinatePairs', function() {
    it('should return an object of x[] and y[] properties', function() {
      const result = coordinates.splitCoodinatePairs([
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
  })

  describe('.splitCoordinate', function() {
    it('should return an array composed from the supplied coordinates', function() {
      expect(coordinates.splitCoordinate('1,  2')).to.deep.equal([1, 2])
    })

    it('should throw if the coordinate is invalid', function() {
      expect(() => coordinates.splitCoordinate('a,  2')).to.throw(
        'The coordinate "a,  2" is not valid'
      )
    })
  })
})
