import { eth, contracts, Log } from 'decentraland-commons'

const log = new Log('EventMonitor')

export class EventMonitor {
  constructor(contractName, eventNames) {
    this.contractName = contractName
    this.eventNames = eventNames
  }

  getContract() {
    const contract = contracts[this.contractName]

    if (!contract) {
      throw new Error(
        `You need to supply a valid contract name, "${
          this.contractName
        }" not found. Valid options are ${Object.keys(contracts)}`
      )
    }

    return contract
  }

  run(options = {}, callback) {
    const contract = this.getContract()

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

    eth.setContracts([contract])

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

  getEvent(eventName) {
    return eth.getContract(this.contractName).getEvent(eventName)
  }
}
