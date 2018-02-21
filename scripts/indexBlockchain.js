#!/usr/bin/env babel-node

import { Log, env, eth, contracts } from 'decentraland-commons'
import { db } from '../src/database'
import { Parcel, ParcelService } from '../src/Parcel'
import { asyncBatch } from '../src/lib/asyncBatch'

const log = new Log('update')

env.load()

const BATCH_SIZE = env.get('INDEX_BATCH_SIZE', 1000)

export async function indexBlockchain() {
  log.info('Indexing `parcels`')
  await indexParcels()
}

async function indexParcels() {
  const service = new ParcelService()
  const parcels = await Parcel.find()

  let updates = []
  let total = BATCH_SIZE

  await asyncBatch({
    elements: parcels,
    callback: async newParcels => {
      newParcels = await service.addLandData(newParcels)
      newParcels = await service.addOwners(newParcels)

      log.info(`Indexing ${total}/${parcels.length} parcels`)

      updates = updates.concat(
        newParcels.map(({ id, ...parcel }) => Parcel.update(parcel, { id }))
      )

      total += newParcels.length
    },
    batchSize: BATCH_SIZE
  })
  log.info('Waiting for the Database operations to finish')

  await Promise.all(updates)

  log.info('All done')
}

if (require.main === module) {
  Promise.resolve()
    .then(() => db.connect())
    .then(() => eth.connect({ contracts: [contracts.LANDRegistry] }))
    .then(indexBlockchain)
    .catch(error => console.error('An error occurred.\n', error))
}
