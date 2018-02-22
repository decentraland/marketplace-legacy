import { Log } from 'decentraland-commons'
import { Cli } from './Cli'
import { EventMonitor } from './EventMonitor'

const log = new Log('TransformCli')

export class TransformCli extends Cli {
  addCommands(program) {
    this.defineCommand('transform', program, this.transform)
  }

  transform = (contractName, eventNames, options) => {
    const eventMonitor = new EventMonitor(contractName, eventNames)
    const handler = this.handlers.get('transform', contractName, eventNames)

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
