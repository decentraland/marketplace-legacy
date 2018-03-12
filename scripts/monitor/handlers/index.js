import { Log } from 'decentraland-commons'
import { BlockchainEvent } from '../../../src/BlockchainEvent'

const log = new Log('handlers')

export async function store(eventData) {
  if (eventData.removed) return

  const { event, transactionHash, blockNumber } = eventData

  const exists = await BlockchainEvent.count({
    tx_hash: transactionHash,
    name: event
  })
  if (exists) {
    log.info(`[${event}] Blockchain event ${transactionHash} already exists`)
    return
  }
  log.info(`[${event}] Storing blockchain event ${transactionHash}`)

  const args = Object.keys(eventData.args).reduce(
    (memo, key) =>
      Object.assign(memo, {
        [key]: eventData.args[key].toString()
      }),
    {}
  )

  await BlockchainEvent.insert({
    tx_hash: transactionHash,
    name: event,
    block_number: blockNumber,
    args
  })

  return event
}

export * from './HandlersIndex'
