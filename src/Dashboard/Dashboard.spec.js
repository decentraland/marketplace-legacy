import { expect } from 'chai'
import { txUtils } from 'decentraland-eth'

import { truncateTable } from '../database'
import { DashboardService } from '../Dashboard'
import { Publication } from '../Publication'
import { Parcel } from '../Parcel'

describe('Dashboard', function() {
  describe('#getStats', function() {
    before(() =>
      Promise.all([
        Parcel.create({ x: 0, y: 0, owner: '0x1' }),
        Parcel.create({ x: 0, y: 1, owner: '0x1' }),
        Parcel.create({ x: 1, y: 0, owner: '0x2' }),
        Parcel.create({ x: 1, y: 1, owner: '0x2' }),
        Parcel.create({ x: 2, y: 0, owner: '0x3' }),
        Parcel.create({ x: 2, y: 1, owner: '0x4' }),
        Publication.create({
          tx_hash: '0x10',
          x: 0,
          y: 0,
          owner: '0x1',
          contract_id: '0x1',
          block_number: 0,
          price: 0,
          expires_at: Date.now() * 1000 + 100,
          status: Publication.STATUS.open,
          tx_status: txUtils.TRANSACTION_STATUS.confirmed
        }),
        Publication.create({
          tx_hash: '0x20',
          x: 1,
          y: 0,
          owner: '0x2',
          contract_id: '0x2',
          block_number: 1,
          price: 1,
          status: Publication.STATUS.sold,
          tx_status: txUtils.TRANSACTION_STATUS.confirmed
        }),
        Publication.create({
          tx_hash: '0x30',
          x: 1,
          y: 1,
          owner: '0x2',
          contract_id: '0x3',
          block_number: 2,
          price: 2,
          status: Publication.STATUS.cancelled,
          tx_status: txUtils.TRANSACTION_STATUS.confirmed
        })
      ])
    )

    it('should return the number of landOwners', async function() {
      const { landOwnersCount } = await new DashboardService().getStats()
      expect(landOwnersCount).to.be.equal(4)
    })

    it('should return the number of activeUsersCount', async function() {
      const { activeUsersCount } = await new DashboardService().getStats()
      expect(activeUsersCount).to.be.equal(2)
    })

    it('should return the number of totalLandTraded', async function() {
      const { totalLandTraded } = await new DashboardService().getStats()
      expect(totalLandTraded).to.be.equal(1)
    })

    it('should return the number of totalLandOnSale', async function() {
      const { totalLandOnSale } = await new DashboardService().getStats()
      expect(totalLandOnSale).to.be.equal(1)
    })

    after(() =>
      Promise.all(
        [Parcel, Publication].map(Model => truncateTable(Model.tableName))
      )
    )
  })
})
