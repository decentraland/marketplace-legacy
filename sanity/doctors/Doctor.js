import { Log } from 'decentraland-commons'

export class Doctor {
  constructor() {
    this.log = new Log(this.constructor.name)
  }

  async diagnose(options) {
    throw new Error('Not implemented')
  }
}
