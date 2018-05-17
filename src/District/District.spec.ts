import { expect } from 'chai'

import { db } from '../database'
import { District } from './District.model'

describe('District', function() {
  describe('.findEnabled', function() {
    it('should only return enabled districts', async function() {
      await Promise.all([
        District.insert({ id: '1', name: 'Enabled 1', disabled: false }),
        District.insert({ id: '2', name: 'Disabled', disabled: true }),
        District.insert({ id: '3', name: 'Enabled 2', disabled: false })
      ])

      const districts = await District.findEnabled()
      const districtNames = districts.map(district => district.name).sort()

      expect(districtNames).to.be.deep.equal(['Enabled 1', 'Enabled 2'])
    })
  })

  afterEach(() => db.truncate(District.tableName))
})
