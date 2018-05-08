import { BlockchainEvent } from '../../../src/BlockchainEvent'

export async function collect(eventData) {
  if (eventData.removed) return

  const { event, transactionHash, blockNumber, logIndex, args } = eventData

  process.stdout.write(
    `[${event}] Storing blockchain event ${transactionHash}              \r`
  )

  await BlockchainEvent.createWithoutConflicts({
    tx_hash: transactionHash,
    name: event,
    block_number: blockNumber,
    log_index: logIndex,
    args: transformArgValuesToString(args)
  })

  return event
}

function transformArgValuesToString(args) {
  return Object.keys(args).reduce((memo, key) => {
    memo[key] = args[key].toString()
    return memo
  }, {})
}

export * from './Handlers'
