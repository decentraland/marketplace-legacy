import { Log } from 'decentraland-commons'
import { BlockchainEvent } from '../../src/BlockchainEvent'

const log = new Log('handlers')

export async function index(eventData) {
  if (eventData.removed) return

  const {
    event,
    transactionHash,
    blockNumber,
    logIndex,
    args,
    address
  } = eventData

  log.info(`[${event}] Storing blockchain event ${transactionHash}`)

  await BlockchainEvent.insertWithoutConflicts({
    tx_hash: transactionHash,
    name: event,
    block_number: blockNumber,
    log_index: logIndex,
    args: transformArgValuesToString(args),
    address
  })
}

function transformArgValuesToString(args) {
  return Object.keys(args).reduce((memo, key) => {
    memo[key] = args[key].toString()
    return memo
  }, {})
}

export * from './Handlers'
