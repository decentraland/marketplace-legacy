import { Log } from 'decentraland-commons'
import { BlockchainEvent } from '../../../src/BlockchainEvent'

const log = new Log('handlers')

export async function index(eventData) {
  if (eventData.removed) return

  const { event, transactionHash, blockNumber, logIndex, args } = eventData

  const exists = await BlockchainEvent.count({
    tx_hash: transactionHash,
    log_index: logIndex
  })
  if (exists) {
    log.info(`[${event}] Blockchain event ${transactionHash} already exists`)
    return
  }
  log.info(`[${event}] Storing blockchain event ${transactionHash}`)

  await BlockchainEvent.insert({
    tx_hash: transactionHash,
    name: event,
    block_number: blockNumber,
    log_index: logIndex,
    args: transformArgValuesToString(args)
  })
}

function transformArgValuesToString(args) {
  return Object.keys(args).reduce((memo, key) => {
    memo[key] = args[key].toString()
    return memo
  }, {})
}

export * from './HandlersIndex'
