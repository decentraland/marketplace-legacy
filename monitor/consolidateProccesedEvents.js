import { Log } from 'decentraland-commons'

import { Publication } from '../src/Listing'
import { Tile } from '../src/Tile'
import { asyncBatch } from '../src/lib'

const log = new Log('consolidateProccesedEvents')

export async function consolidateProccesedEvents() {
  log.info('Cancelling inactive publications')
  const inactivePublications = await Publication.findInactive()
  await Publication.cancelInactive()

  log.info('Updating tiles')
  await asyncBatch({
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
