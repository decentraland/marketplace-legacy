import { Log } from 'decentraland-commons'
import { processEvent } from '../../monitor/processEvents'

const log = new Log('Diagnosis')

export class Diagnosis {
  async doTreatment() {
    throw new Error('Not implemented')
  }

  getFaultyAssets() {
    throw new Error('Not implemented')
  }

  hasProblems() {
    throw new Error('Not implemented')
  }

  async prepare() {
    throw new Error('Not implemented')
  }

  async replayEvents(events) {
    for (let i = 0; i < events.length; i++) {
      log.info(`[${i + 1}/${events.length}] Processing ${events[i].name}`)
      await processEvent(events[i])
    }
  }
}
