import { Log } from 'decentraland-commons'

import { Estate } from '../src/Asset'
import { Publication } from '../src/Listing'
import { Tile } from '../src/Tile'
import { asyncBatch } from '../src/lib'

const log = new Log('consolidateProccesedEvents')

export async function consolidateProccesedEvents() {
  await Promise.all([cancelInactivePublications(), updateEstateDistrinctIds()])
}

async function cancelInactivePublications() {
  log.info('Cancelling inactive publications')
  const inactivePublications = await Publication.findInactive()
  await Publication.cancelInactive()

  log.info('Updating tiles')
  return asyncBatch({
    elements: inactivePublications,
    callback: async publications => {
      const upserts = publications.map(publication =>
        Tile.upsertAsset(publication.asset_id, publication.asset_type)
      )
      await Promise.all(upserts)
    },
    batchSize: 20
  })
}

async function updateEstateDistrinctIds() {
  log.info('Updating estate district ids')
  return Estate.updateEstateDistrictIds()
}
