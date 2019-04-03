import { Log } from 'decentraland-commons'
import { processEvent } from '../../monitor/processEvents'

export class Diagnosis {
  constructor() {
    this.log = new Log(this.constructor.name)
  }

  async doTreatment() {
    throw new Error('Not implemented')
  }

  getFaultyAssets() {
    throw new Error('Not implemented')
  }

  hasProblems() {
    throw new Error('Not implemented')
  }

  async prepare(fromBlock) {
    throw new Error('Not implemented')
  }

  async replayEvents(events) {
    for (let i = 0; i < events.length; i++) {
      this.log.info(`[${i + 1}/${events.length}] Processing ${events[i].name}`)
      await processEvent(events[i])
    }
  }
}
