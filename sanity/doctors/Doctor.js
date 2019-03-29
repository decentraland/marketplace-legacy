import { Log } from 'decentraland-commons'

export class Doctor {
  constructor() {
    this.log = new Log(this.constructor.name)
  }

  async diagnose(options) {
    throw new Error('Not implemented')
  }

  logErrors(faultyAssets) {
    this.log.error(faultyAssets.map(({ error }) => error).join('\n'))
  }
}
