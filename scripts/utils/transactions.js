import { eth, txUtils } from 'decentraland-eth'
import { utils } from 'decentraland-commons'

import { asyncBatch } from '../../src/lib'
import { connectEth } from '../../src/ethereum'

export async function setupEth(options) {
  const account = options.account || eth.getAccount()

  console.log('Connecting to a node')

  await connectEth(options)

  if (!eth.isConnected()) {
    throw new Error('Connection to the node failed')
  }

  if (options.password) {
    console.log(`Unlocking account ${account}`)
    eth.wallet.setAccount(account)
    await eth.wallet.unlockAccount(options.password)
  }
}

export async function executeTransactions(
  elements,
  callback,
  { batchSize, txDelay }
) {
  const txs = []
  const txsToRetry = []

  await asyncBatch({
    elements: elements,
    callback: async elementsBatch => {
      const elementTxs = await Promise.all(callback(elementsBatch))

      for (const tx of elementTxs) {
        console.log(`Got tx hash ${tx.hash}`)
        txs.push(tx)
      }

      console.log(`Sleeping ${txDelay / 1000} seconds`)
      await utils.sleep(txDelay)
    },
    batchSize: batchSize
  })

  for (const tx of txs) {
    console.log(`Waiting for tx: ${tx.hash}`)
    const transaction = await getConfirmedTransaction(tx.hash)

    if (transaction === null) {
      txsToRetry.push(tx)
    }
  }

  return txsToRetry
}

export async function getConfirmedTransaction(hash, retries = 0) {
  try {
    return await txUtils.getConfirmedTransaction(hash)
  } catch (error) {
    if (retries >= 3) {
      console.log(
        `[WARN] tx ${hash} failed after ${retries} retries: "${error}"`
      )
      return null
    } else {
      console.log(
        `Found an error with tx: ${hash}, retrying in 10 seconds to mitigate false fails`
      )
      await utils.sleep(10000)
      return getConfirmedTransaction(hash, retries + 1)
    }
  }
}
