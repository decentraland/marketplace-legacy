import { cli, Log } from 'decentraland-commons'
import { HandlersIndex } from './handlers'
import { EventMonitor } from './EventMonitor'
import { processEvents } from './processEvents'
import { BlockchainEvent } from '../../src/BlockchainEvent'

const log = new Log('MonitorCli')

export class MonitorCli {
  constructor(handlers, contractEvents = {}, processDelay) {
    this.handlers = new HandlersIndex(handlers)

    this.contractEvents = contractEvents
    this.processDelay = processDelay
    this.processTimeout = null
    this.isProcessRunning = false
  }

  run() {
    cli.runProgram([this])
  }

  addCommands(program) {
    program
      .command('index')
      .option(
        '--args [args]',
        'JSON string containing args to filter by. Defaults to {}'
      )
      .option(
        '--from-block [fromBlock]',
        'The number of the earliest block. Defaults to 0'
      )
      .option(
        '--to-block [toBlock]',
        'The number of the latest block. Defaults to `latest`'
      )
      .option(
        '--address [address]',
        'An address to only get logs from particular account(s).'
      )
      .option(
        '-w, --watch',
        'Keep watching the blockchain for new events after --to-block.'
      )
      .action(this.index)
  }

  index = options => {
    for (const contractName in this.contractEvents) {
      const eventNames = this.contractEvents[contractName]
      this.monitor(contractName, eventNames, options)
    }
  }

  processStoredEvents = fromBlock => {
    if (this.isProcessRunning) {
      return setTimeout(
        () => this.processStoredEvents(fromBlock),
        this.processDelay
      )
    }
    clearTimeout(this.processTimeout)

    this.processTimeout = setTimeout(() => {
      this.isProcessRunning = true
      processEvents(fromBlock).then(() => (this.isProcessRunning = false))
    }, this.processDelay)
  }

  async monitor(contractName, eventNames, options) {
    const eventMonitor = new EventMonitor(contractName, eventNames)
    const handler = this.handlers.get('index', contractName, eventNames)

    if (!handler) throw new Error('Could not find a valid handler')

    const fromBlock = await this.getFromBlock(options)

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

        this.processStoredEvents(fromBlock)
      }
    })
  }

  async getFromBlock(options) {
    return options.fromBlock === 'latest'
      ? await BlockchainEvent.findLastBlockNumber()
      : options.fromBlock
  }
}
