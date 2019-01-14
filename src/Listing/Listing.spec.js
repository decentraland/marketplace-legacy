import { expect } from 'chai'

import { Parcel, Estate } from '../Asset'
import { Listing } from './Listing'
import { ASSET_TYPES } from '../shared/asset'

describe('Listing', function() {
  describe('#getListableAsset', function() {
    it('should return the model class for the supplied type', function() {
      expect(Listing.getListableAsset(ASSET_TYPES.parcel)).to.be.equal(Parcel)
      expect(Listing.getListableAsset(ASSET_TYPES.estate)).to.be.equal(Estate)
    })

    it('should throw if the type is invalid', function() {
      expect(() => new Listing.getListableAsset('Nonsense')).to.throw(
        'Invalid publication asset_type "Nonsense"'
      )
    })
  })
})
