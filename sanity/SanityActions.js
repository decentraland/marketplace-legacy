import { Log, env } from 'decentraland-commons'
import { eth } from 'decentraland-eth'

import { MonitorActions } from '../monitor/MonitorActions'
import { main as indexMissingEvents } from '../monitor/program'
import { doctors } from './doctors'
import { getNumberTypesOfEvents } from '../src/ethereum'

const log = new Log('Sanity')

export class SanityActions {
  async run(options = {}) {
    const validations = this.getValidations(options.skip)
    const diagnostics = []
    const total = validations.length

    for (let i = 0; i < total; i++) {
      const key = validations[i]

      log.info(`[${i + 1}/${total}]: Running ${key}`)
      const doctor = new doctors[key]()
      const diagnoses = await doctor.diagnose(options)

      if (!diagnoses.hasProblems()) continue

      diagnostics.push(diagnoses)

      if (options.selfHeal) {
        log.info(`Preparing ${key} problems`)
        await diagnoses.prepare()
      }
    }

    if (options.selfHeal) {
      await this.selfHeal(diagnostics)
    }
  }

  getValidations(skip = '') {
    const skippedValidations = skip.toLowerCase().split(',')

    return Object.keys(doctors).filter(
      key => !skippedValidations.includes(key.toLowerCase())
    )
  }

  async selfHeal(diagnostics) {
    if (diagnostics.length > 0) {
      log.info('Attempting to heal problems. Re-fetching events')

      // @nico Hack: change the command name so we can keep the flags but run the monitor
      process.argv = process.argv.map(arg => (arg === 'run' ? 'index' : arg))

      await indexMissingEvents(
        (...args) => new SanitiyMonitorActions(diagnostics, ...args)
      )
    }
  }
}

class SanitiyMonitorActions extends MonitorActions {
  constructor(diagnostics, ...args) {
    super(...args)
    this.diagnostics = diagnostics
    this.resolve = {}
  }

  async monitor(contractName, eventNames, options) {
    options.watch = false
    options.skipProcess = true

    const steps = parseInt(env.get('BLOCK_STEP', 50000), 10)
    const lastBlock = await eth.getBlockNumber()
    const times = lastBlock / steps + 1
    console.log(lastBlock)
    for (let i = 0; i < times; i++) {
      const fromBlock = steps * i

      // Stop the loop if last block is achieved
      if (fromBlock >= lastBlock) {
        continue
      }

      let toBlock = steps * (i + 1)
      // Set toBlock to latest if last block is achieved
      if (toBlock >= lastBlock) {
        toBlock = 'latest'
      }
      // loop eventNames
      const promises = []

      log.info(
        `[${contractName}] Getting events from ${fromBlock} to ${toBlock}`
      )

      for (let eventName of eventNames) {
        if (!this.resolve[contractName]) {
          this.resolve[contractName] = {}
        }

        if (!this.resolve[contractName][eventName]) {
          this.resolve[contractName][eventName] = {}
        }

        if (!this.resolve[contractName][eventName][`${fromBlock}-${toBlock}`]) {
          this.resolve[contractName][eventName][`${fromBlock}-${toBlock}`] = []
        }

        const numberTypeEvents = getNumberTypesOfEvents(contractName, eventName)
        for (let j = 0; j < numberTypeEvents; j++) {
          const promise = new Promise(res =>
            this.resolve[contractName][eventName][
              `${fromBlock}-${toBlock}`
            ].push(res)
          )
          promises.push(promise)
        }
      }

      super.monitor(contractName, eventNames, {
        ...options,
        fromBlock,
        toBlock
      })

      await Promise.all(promises)
    }
  }

  processEvents() {
    log.info('Do nothing...')
    return new Promise(res => res(true))
  }

  async _processEvents() {
    log.info('Replaying events for inconsistent data')

    for (const diagnoses of this.diagnostics) {
      await diagnoses.doTreatment()
    }

    log.info('All done!')
    process.exit()
  }

  async finish(options) {
    if (options.monitorFinished) {
      await this._processEvents()
    } else {
      const fromBlock = options.fromBlock
      const toBlock = options.toBlock

      log.info(
        `[${options.contractName}] - ${
          options.eventName
        } Finished events from ${options.fromBlock} to ${options.toBlock}`
      )
      if (
        this.resolve[options.contractName][options.eventName][
          `${fromBlock}-${toBlock}`
        ]
      ) {
        this.resolve[options.contractName][options.eventName][
          `${fromBlock}-${toBlock}`
        ][0](true)
        this.resolve[options.contractName][options.eventName][
          `${fromBlock}-${toBlock}`
        ].shift()
      }
    }
  }
}
