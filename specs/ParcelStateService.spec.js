import { expect } from 'chai'
import sinon from 'sinon'

import { ParcelStateService } from '../src/lib/services'

describe('ParcelStateService', function() {
  let ParcelState
  let parcelStateService

  beforeEach(() => {
    ParcelState = { insert: () => Promise.resolve() }

    parcelStateService = new ParcelStateService()
    parcelStateService.ParcelState = ParcelState
  })

  describe('#insertMatrix', function() {
    it('should call the `insert` method of parcel state for each element of the matrix', async function() {
      const spy = sinon.spy(ParcelState, 'insert')

      await parcelStateService.insertMatrix(-1, -1, 1, 2)

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

      sinon.stub(ParcelState, 'insert').returns(Promise.reject(error))

      return expect(
        parcelStateService.insertMatrix(0, 0, 1, 1)
      ).not.to.be.rejectedWith(error)
    })
  })
})
