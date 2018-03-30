import { Log } from 'decentraland-commons'
import { Cli } from './Cli'
import { EventMonitor } from './EventMonitor'
import { processEvents } from './processEvents'

const log = new Log('StoreCli')

export class StoreCli extends Cli {
  constructor(handlers, contractEvents = {}, processDelay) {
    super(handlers)
    this.contractEvents = contractEvents
    this.processDelay = processDelay
    this.processTimeout = null
    this.isProcessRunning = false
  }

  addCommands(program) {
    this.defineCommand('store', program, this.store)
  }

  store = options => {
    for (const contractName in this.contractEvents) {
      const eventNames = this.contractEvents[contractName]
      this.monitor(contractName, eventNames, options)
    }

    this.processStoredEvents()
  }

  processStoredEvents = () => {
    if (this.isProcessRunning) {
      return setTimeout(this.processStoredEvents, this.processDelay)
    }
    clearTimeout(this.processTimeout)

    this.processTimeout = setTimeout(() => {
      log.info('Firing up event persister')
      this.isProcessRunning = true
      processEvents().then(() => (this.isProcessRunning = false))
    }, this.processDelay)
  }

  monitor = (contractName, eventNames, options) => {
    const eventMonitor = new EventMonitor(contractName, eventNames)
    const handler = this.handlers.get('store', contractName, eventNames)

    if (!handler) throw new Error('Could not find a valid handler')

    eventMonitor.run(options, async (error, logs) => {
      if (error) {
        log.error(`Error monitoring "${contractName}" for "${eventNames}"`)
        log.error(error)
      } else {
        if (Array.isArray(logs)) {
          await Promise.all(logs.map(log => handler(log)))
        } else {
          await handler(logs)
        }

        this.processStoredEvents()
      }
    })
  }
}
