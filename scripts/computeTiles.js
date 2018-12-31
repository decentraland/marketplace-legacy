#!/usr/bin/env babel-node

import { Log, env } from 'decentraland-commons'

import { db } from '../src/database'
import { Tile } from '../src/Tile'
import { Parcel } from '../src/Asset'
import { asyncBatch } from '../src/lib'
import { loadEnv } from './utils'

const log = new Log('computeTiles')

export async function computeTiles() {
  log.info('Connecting database')
  await db.connect()

  const allParcels = await Parcel.find()

  await asyncBatch({
    elements: allParcels,
    callback: parcels =>
      Promise.all(parcels.map(parcel => Tile.upsertParcel(parcel))),
    batchSize: env.get('BATCH_SIZE'),
    retryAttempts: 0
  })

  log.info('All done!')
  process.exit()
}

if (require.main === module) {
  loadEnv()

  Promise.resolve()
    .then(computeTiles)
    .catch(console.error)
}
