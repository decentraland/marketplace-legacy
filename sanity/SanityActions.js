import { Log } from 'decentraland-commons'
import { MonitorActions } from '../monitor/MonitorActions'
import { main as indexMissingEvents } from '../monitor/program'
import { doctors } from './doctors'

const log = new Log('Sanity')

export class SanityActions {
  async run(options) {
    const validations = this.getValidations(options.skip)
    const diagnostics = []
    const total = validations.length

    for (let i = 0; i < total; i++) {
      const key = validations[i]

      log.info(`[${i + 1}/${total}]: Running ${key}`)
      const doctor = new doctors[key]()
      const diagnosis = await doctor.diagnose(options)

      if (!diagnosis.hasProblems()) continue

      diagnostics.push(diagnosis)

      if (options.selfHeal) {
        log.info(`Preparing ${key} problems`)
        await diagnosis.prepare()
      }
    }

    if (options.selfHeal) {
      await this.selfHeal(diagnostics)
    } else {
      process.exit()
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
  }

  monitor(contractName, eventNames, options) {
    options.watch = false
    return super.monitor(contractName, eventNames, options)
  }

  async processEvents() {
    log.info('Replaying events for inconsistent data')

    for (const diagnosis of this.diagnostics) {
      await diagnosis.doTreatment()
    }

    log.info('All done!')
    process.exit()
  }
}
