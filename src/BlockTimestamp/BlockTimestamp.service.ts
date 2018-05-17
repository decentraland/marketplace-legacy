import { eth } from 'decentraland-eth'

import { BlockTimestamp } from './BlockTimestamp.model'

export class BlockTimestampService {
  BlockTimestamp: typeof BlockTimestamp

  constructor() {
    this.BlockTimestamp = BlockTimestamp
  }

  async getBlockTime(blockNumber: number): Promise<number> {
    let timestamp = await BlockTimestamp.findTimestamp(blockNumber)
    if (!timestamp) {
      timestamp = await this.getBlockchainTimestamp(blockNumber)
      this.insertTimestamp(blockNumber, timestamp)
    }

    return timestamp
  }

  // TODO: Move to decentraland-eth
  getBlockchainTimestamp(blockNumber: number): Promise<number> {
    const web3 = eth.wallet.getWeb3()

    return new Promise((resolve, reject) => {
      web3.eth.getBlock(blockNumber, (error, block) => {
        if (error || !block) {
          reject(error)
        } else {
          resolve(block.timestamp * 1000)
        }
      })
    })
  }

  insertTimestamp(blockNumber: number, timestamp: number) {
    // Cache for later
    return BlockTimestamp.insert({
      block_number: blockNumber,
      timestamp
    }).catch(() => {
      // Don't do anything
    })
  }
}
