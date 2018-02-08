import { eth, utils } from 'decentraland-commons'
import { MANAToken } from 'decentraland-commons/dist/contracts/MANAToken'
import { LANDRegistry } from 'decentraland-commons/dist/contracts/LANDRegistry'
import { Marketplace } from 'decentraland-commons/dist/contracts/Marketplace'

export async function connectEthereumWallet(retries = 0) {
  try {
    let connected = await eth.connect({
      contracts: [MANAToken, LANDRegistry, Marketplace]
    })
    if (!connected) throw new Error('Could not connect to Ethereum')
  } catch (error) {
    if (retries >= 3) {
      console.warn(
        `Error trying to connect to Ethereum for the ${retries}th time`,
        error
      )
      throw error
    }
    await utils.sleep(500)
    return connectEthereumWallet(retries + 1)
  }
}

export function getManaToApprove() {
  return 100000 // 100k
}
