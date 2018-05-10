import { expect } from 'chai'

import { truncateTable } from '../database'
import { BlockchainEvent } from './BlockchainEvent.model'

describe('BlockchainEvent', function() {
  describe('.findLastBlockNumber', function() {
    it('should return the last block_number', async function() {
      await Promise.all([
        BlockchainEvent.create({
          tx_hash: '0x1',
          block_number: 22,
          log_index: 1,
          name: 'AuctionCreated'
        }),
        BlockchainEvent.create({
          tx_hash: '0x2',
          block_number: 10,
          log_index: 1,
          name: 'AuctionCreated'
        })
      ])

      const block_number = await BlockchainEvent.findLastBlockNumber()
      expect(block_number).to.be.equal('22')
    })

    after(() => truncateTable(BlockchainEvent.tableName))
  })
})
