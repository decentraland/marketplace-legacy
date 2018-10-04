import { Log } from 'decentraland-commons'
import { Handlers } from './handlers'
import { EventMonitor } from './EventMonitor'
import { processEvents } from './processEvents'
import { BlockchainEvent } from '../src/BlockchainEvent'

const log = new Log('Monitor')

export class MonitorActions {
  constructor(handlers, contractEvents = {}, processDelay) {
    this.handlers = new Handlers(handlers)

    this.contractEvents = contractEvents
    this.processDelay = processDelay
    this.processTimeout = null
    this.isProcessRunning = false
  }

  index = options => {
    for (const contractName in this.contractEvents) {
      const eventNames = this.contractEvents[contractName].eventNames

      this.monitor(contractName, eventNames, options).catch(this.onError)
    }
  }

  processStoredEvents = (fromBlock, callback = () => {}) => {
    if (this.isProcessRunning) {
      return setTimeout(
        () => this.processStoredEvents(fromBlock, callback),
        this.processDelay
      )
    }
    clearTimeout(this.processTimeout)

    this.processTimeout = setTimeout(() => {
      this.isProcessRunning = true

      this.processEvents(fromBlock)
        .then(() => {
          this.isProcessRunning = false
          callback()
        })
        .catch(this.onError)
    }, this.processDelay)
  }

  processEvents(fromBlock) {
    return processEvents(fromBlock)
  }

  async monitor(contractName, eventNames, options) {
    const eventMonitor = new EventMonitor(contractName, eventNames)
    const handler = this.handlers.get('index', contractName, eventNames)

    if (!handler) throw new Error('Could not find a valid handler')

    const fromBlock = await this.getFromBlock(options)
    const onEnd = () => this.finish(options)
    const monitorOptions = { ...options, fromBlock }

    eventMonitor.run(monitorOptions, async (error, logs) => {
      if (error) {
        log.error(`Error monitoring "${contractName}" for "${eventNames}"`)
        this.onError(error)
      } else {
        if (Array.isArray(logs)) {
          await Promise.all(logs.map(log => handler(log)))
        } else {
          await handler(logs)
        }

        if (options.skipProcess) {
          onEnd()
        } else {
          this.processStoredEvents(fromBlock, onEnd)
        }
      }
    })
  }

  async getFromBlock(options) {
    return options.fromBlock === 'latest'
      ? await BlockchainEvent.findLastBlockNumber()
      : options.fromBlock
  }

  onError(error) {
    log.error(error)
    process.exit(1)
  }

  finish(options) {
    if (!options.watch) {
      process.exit()
    }
  }
}
