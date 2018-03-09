import { Log } from 'decentraland-commons'
import { Cli } from './Cli'
import { EventMonitor } from './EventMonitor'

const log = new Log('StoreCli')

export class StoreCli extends Cli {
  constructor(handlers, contractEvents = {}) {
    super(handlers)
    this.contractEvents = contractEvents
  }

  addCommands(program) {
    this.defineCommand('store', program, this.store)
  }

  store = options => {
    for (const contractName in this.contractEvents) {
      const eventNames = this.contractEvents[contractName]
      this.monitor(contractName, eventNames, options)
    }
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
        await handler(logs)
      }
    })
  }
}
