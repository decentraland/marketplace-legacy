import { expect } from 'chai'

import { Approval } from './Approval.model'
import { db } from '../database'

describe('Approval', function() {
  beforeEach(async function() {
    await Approval.insertApproval('0x', '0x1', '0x2')
    await Approval.insertApproval('0x', '0x1', '0x3')
    await Approval.insertApproval('0x', '0xa', '0x2')
    await Approval.insertApproval('0x', '0xa', '0x3')
  })

  describe('#isApprovedForAll', function() {
    it('should return if isApprovedForAll', async function() {
      let isApprovedForAll = await Approval.isApprovedForAll('0x', '0x1', '0x2')
      expect(isApprovedForAll).to.be.equal(true)

      isApprovedForAll = await Approval.isApprovedForAll('0x', '0x1', '0x3')
      expect(isApprovedForAll).to.be.equal(true)

      isApprovedForAll = await Approval.isApprovedForAll('0x', '0x1', '0x4')
      expect(isApprovedForAll).to.be.equal(false)
    })
  })

  afterEach(() =>
    Promise.all([Approval].map(Model => db.truncate(Model.tableName))))
})
