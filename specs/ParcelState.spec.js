import { expect } from 'chai'
import { utils } from 'decentraland-commons'

import db from '../src/lib/db'
import { ParcelState } from '../src/lib/models'
import { ParcelStateService } from '../src/lib/services'

describe('ParcelState', function() {
  describe('.findByCoordinate', function() {
    it('should find the parcel state for the supplied coordinate', async function() {
      await new ParcelStateService().insertMatrix(-1, -1, 3, 3)

      const result = await ParcelState.findByCoordinate(1, 2)
      const parcelState = utils.omit(result[0], ['createdAt', 'updatedAt'])

      expect(result.length).to.be.equal(1)
      expect(parcelState).to.deep.equal({
        id: '1,2',
        x: 1,
        y: 2,
        address: null,
        amount: null,
        bidGroupId: null,
        bidIndex: null,
        endsAt: null,
        projectId: null
      })
    })
  })

  afterEach(() => Promise.all(['parcel_states'].map(db.truncate.bind(db))))
})
