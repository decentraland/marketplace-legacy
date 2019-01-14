import { expect } from 'chai'

import { Publication } from './Publication.model'
import { PublicationService } from './Publication.service'
import { Parcel, Estate } from '../../Asset'
import { ASSET_TYPES } from '../../shared/asset'

describe('Publication', function() {
  describe('.primaryKey', function() {
    it('should set the primary key to `tx_hash`', function() {
      expect(Publication.primaryKey).to.equal('tx_hash')
    })
  })
})

describe('PublicationService', function() {
  describe('#getPublicableAsset', function() {
    it('should return the model class for the supplied type', function() {
      const service = new PublicationService()
      expect(service.getPublicableAsset(ASSET_TYPES.parcel)).to.be.equal(Parcel)
      expect(service.getPublicableAsset(ASSET_TYPES.estate)).to.be.equal(Estate)
    })

    it('should throw if the type is invalid', function() {
      expect(() =>
        new PublicationService().getPublicableAsset('Nonsense')
      ).to.throw('Invalid publication asset_type "Nonsense"')
    })
  })
})
