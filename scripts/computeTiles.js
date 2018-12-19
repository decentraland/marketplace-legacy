#!/usr/bin/env babel-node

import { Log, env } from 'decentraland-commons'

import { db } from '../src/database'
import { Tile } from '../src/Tile'
import { Parcel } from '../src/Asset'
import { asyncBatch } from '../src/lib'
import { Bounds } from '../shared/map'
import { loadEnv } from './utils'

const log = new Log('computeTiles')

export async function computeTiles() {
  log.info('Connecting database')
  await db.connect()

  const { minX, minY, maxX, maxY } = Bounds.getBounds()
  const nw = `${minX},${maxY}`
  const se = `${maxX},${minY}`
  const allParcels = await Parcel.inRange(nw, se)

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
