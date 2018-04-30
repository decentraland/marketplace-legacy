import { eth } from 'decentraland-eth'

import { BlockTimestamp } from './BlockTimestamp'

export class BlockTimestampService {
  constructor() {
    this.BlockTimestamp = BlockTimestamp
  }

  async getBlockTime(blockNumber) {
    let timestamp = await BlockTimestamp.findTimestamp(blockNumber)
    if (!timestamp) {
      timestamp = await this.getBlockchainTimestamp(blockNumber)
      this.insertTimestamp(blockNumber, timestamp)
    }

    return timestamp
  }

  // TODO: Move to eth.commons
  getBlockchainTimestamp(blockNumber) {
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

  insertTimestamp(blockNumber, timestamp) {
    // cache for later
    return BlockTimestamp.insert({
      block_number: blockNumber,
      timestamp
    }).catch(() => {
      /*Let it slide*/
    })
  }
}
