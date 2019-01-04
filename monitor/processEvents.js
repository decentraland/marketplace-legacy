import { Log } from 'decentraland-commons'

import { BlockchainEvent } from '../src/BlockchainEvent'
import { consolidateProccesedEvents } from './consolidateProccesedEvents'
import { reducers } from './reducers'

const log = new Log('processEvents')

export async function processEvents(fromBlock = 0) {
  const allBlockchainEvents = await BlockchainEvent.findFrom(fromBlock)
  const blockchainEvents = allBlockchainEvents.filter(
    event => !eventCache.get(event)
  )

  if (blockchainEvents.length) {
    log.info(`Persisting ${blockchainEvents.length} events from ${fromBlock}`)

    for (const event of blockchainEvents) {
      await processEvent(event)
      eventCache.set(event)
    }

    log.info(`Consolidating processed data from ${fromBlock}`)
    await consolidateProccesedEvents(blockchainEvents)
  } else {
    const lastBlockNumber = await BlockchainEvent.findLastBlockNumber()
    log.info(`No new events to persist. Last DB block: ${lastBlockNumber}`)
  }
}

export async function processEvent(event) {
  return Promise.all(Object.values(reducers).map(reducer => reducer(event)))
}

const eventCache = {
  _values: {
    // [hash+name]: value
  },
  get(event) {
    return eventCache._values[eventCache.getKey(event)]
  },
  set(event) {
    eventCache._values[eventCache.getKey(event)] = true
  },
  getKey(event) {
    return event.tx_hash + event.name
  },
  size() {
    return Object.keys(eventCache._values).length
  }
}
