import { Log } from 'decentraland-commons'

import { Publication } from '../src/Publication'

const log = new Log('consolidateProccesedEvents')

export async function consolidateProccesedEvents() {
  log.info('Cancelling expired publications')
  await Publication.cancelExpired()
}
