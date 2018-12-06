#!/usr/bin/env babel-node

import { Log, env, utils } from 'decentraland-commons'

import { db } from '../src/database'
import { Atlas } from '../src/Map'
import { Parcel } from '../src/Asset'
import { asyncBatch } from '../src/lib'
import { loadEnv } from './utils'

const log = new Log('createAtlas')

export async function createAtlas() {
  log.info('Connecting database')
  await db.connect()

  const allParcels = await Parcel.find()

  // TODO: Upsert data
  await db.truncate(Atlas.tableName)

  await asyncBatch({
    elements: allParcels,
    callback: parcels => Promise.all(parcels.map(Atlas.insertParcel)),
    batchSize: env.get('BATCH_SIZE'),
    retryAttempts: 0
  })

  log.info('All done!')
  process.exit()
}

if (require.main === module) {
  loadEnv()

  Promise.resolve()
    .then(createAtlas)
    .catch(console.error)
}
