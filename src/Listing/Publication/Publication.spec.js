import { expect } from 'chai'

import { Publication } from './Publication.model'

describe('Publication', function() {
  describe('.primaryKey', function() {
    it('should set the primary key to `tx_hash`', function() {
      expect(Publication.primaryKey).to.equal('tx_hash')
    })
  })
})
