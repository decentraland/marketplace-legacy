#!/usr/bin/env babel-node

import { Log, env, eth, contracts } from 'decentraland-commons'
import { db } from '../src/database'
import { Parcel, ParcelService } from '../src/Parcel'
import { asyncBatch } from '../src/lib/asyncBatch'

const log = new Log('update')

env.load()

const BATCH_SIZE = 200

export async function indexBlockchain() {
  log.info('Indexing `parcels`')
  await indexParcels()
}

async function indexParcels() {
  const service = new ParcelService()
  const parcels = await Parcel.find()

  let total = BATCH_SIZE

  await asyncBatch({
    elements: parcels,
    callback: async newParcels => {
      newParcels = await service.addLandData(newParcels)
      newParcels = await service.addOwners(newParcels)

      log.info(`Indexing ${total}/${parcels.length} parcels`)

      await Promise.all(
        newParcels.map(({ id, ...parcel }) => Parcel.update(parcel, { id }))
      )

      total += newParcels.length
    },
    batchSize: BATCH_SIZE
  })
}

Promise.resolve()
  .then(() => db.connect())
  .then(() => eth.connect({ contracts: [contracts.LANDRegistry] }))
  .then(indexBlockchain)
  .catch(error => console.error('An error occurred.\n', error))
