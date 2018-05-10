import { expect } from 'chai'
import uuid from 'uuid'

import { truncateTable } from '../database'
import { Contribution } from './Contribution.model'

describe('Contribution', function() {
  describe('#findGroupedByAddress', function() {
    const first_district_id = uuid.v4()
    const second_district_id = uuid.v4()
    const address = '0x1'

    before(() => {
      return Promise.all([
        Contribution.create({
          address,
          land_count: 10,
          district_id: first_district_id,
          timestamp: Date.now().toString()
        }),
        Contribution.create({
          address,
          land_count: 2,
          district_id: first_district_id,
          timestamp: Date.now().toString()
        }),
        Contribution.create({
          address,
          land_count: 8,
          district_id: second_district_id,
          timestamp: Date.now().toString()
        }),
        Contribution.create({
          address: '0x2',
          land_count: 1,
          district_id: uuid.v4(),
          timestamp: Date.now().toString()
        }),
        Contribution.create({
          address: '0x3',
          land_count: 6,
          district_id: uuid.v4(),
          timestamp: Date.now().toString()
        })
      ])
    })

    it('should return the number of landOwners', async function() {
      const contributions = (await Contribution.findGroupedByAddress(
        address
      )).sort((a, b) => parseInt(a.land_count, 10) - parseInt(b.land_count, 10))

      expect(contributions.length).to.equal(2)
      expect(contributions).to.deep.equal([
        { address, land_count: '8', district_id: second_district_id },
        { address, land_count: '12', district_id: first_district_id }
      ])
    })

    after(() => truncateTable(Contribution.tableName))
  })
})
