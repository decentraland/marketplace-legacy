import { eth } from 'decentraland-eth'
import { Log } from 'decentraland-commons'

const log = new Log('EventMonitor')

export class EventMonitor {
  constructor(contractName, eventNames) {
    this.contractName = contractName
    this.eventNames = eventNames
  }

  /**
   * Watch or filter events for the contract
   * @param  {object}   options
   * @param  {boolean} [options.watch] - If true, the connection will remain open for new events
   * @param  {number|string} [options.fromBlock=0] - The number of the earliest block. latest means the most recent and pending currently mining, block
   * @param  {number|string} [options.toBlock='latest'] - The number of the latest block latest means the most recent and pending currently mining, block
   * @param  {string} [options.address] - An address or a list of addresses to only get logs from particular account(s).
   * @param  {function} callback - Node style callback, receiving (error, eventLogs)
   */
  run(options = {}, callback) {
    const { watch, fromBlock = 0, toBlock = 'latest', address = '' } = options

    const action = watch ? 'watchByType' : 'getAllByType'
    const eventOptions = {
      fromBlock,
      toBlock,
      address
    }

    for (let eventName of this.eventNames) {
      log.info(
        `Running "${action}" with ${eventName} events for ${
          this.contractName
        } with opts: ${JSON.stringify(eventOptions)}`
      )

      const event = this.getEvent(eventName)
      event[action](eventOptions, callback(eventName))
    }
  }

  getEvent(eventName) {
    return eth.getContract(this.contractName).getEvent(eventName)
  }
}
