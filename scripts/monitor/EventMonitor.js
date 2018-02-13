import { eth, contracts, Log } from 'decentraland-commons'

const log = new Log('EventMonitor')

export class EventMonitor {
  constructor(contractName, eventNames) {
    this.setContract(contractName)

    this.contractName = contractName
    this.eventNames = eventNames
  }

  /**
   * Watch or filter events for the contract
   * @param  {object}   options
   * @param  {boolean} [options.watch] - If true, the connection will remain open for new events
   * @param  {string} [options.args] - Stringified return values you want to filter the logs by
   * @param  {number|string} [options.fromBlock=0] - The number of the earliest block. latest means the most recent and pending currently mining, block
   * @param  {number|string} [options.toBlock='latest'] - The number of the latest block latest means the most recent and pending currently mining, block
   * @param  {string} [options.address] - An address or a list of addresses to only get logs from particular account(s).
   * @param  {function} callback - Node style callback, receiving (error, eventLogs)
   */
  run(options = {}, callback) {
    const {
      watch,
      args = '{}',
      fromBlock = 0,
      toBlock = 'latest',
      address = ''
    } = options

    const action = watch ? 'watch' : 'getAll'
    const eventArgs = JSON.parse(args)
    const eventOptions = {
      fromBlock,
      toBlock,
      address
    }

    for (let eventName of this.eventNames) {
      log.info(
        `Running "${action}" with ${eventName} events for ${
          this.contractName
        } with args ${args} opts: ${JSON.stringify(eventOptions)}`
      )

      const event = this.getEvent(eventName)
      event[action]({ args: eventArgs, opts: eventOptions }, callback)
    }
  }

  /**
   * Uses decentraland-common's eth and contracts objects to find and set the contract name supplied.
   * It'll throw if it's not defined on the contracts object
   * @param {string} contractName
   */
  setContract(contractName) {
    const contract = contracts[contractName]

    if (!contract) {
      const validNames = Object.keys(contracts).join(', ')
      throw new Error(
        `Could not find contract, "${contractName}". Valid options are ${validNames}`
      )
    }

    eth.setContracts([contract])
  }

  getEvent(eventName) {
    return eth.getContract(this.contractName).getEvent(eventName)
  }
}
